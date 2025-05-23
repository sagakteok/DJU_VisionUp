import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import next from "next";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

dotenv.config();

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const prisma = new PrismaClient();
const userSocketMap = new Map<string, string>();

app.prepare().then(() => {
    const expressApp = express();
    const httpServer = createServer(expressApp);

    expressApp.use(express.json());

    const io = new Server(httpServer, {
        path: "/socket.io",
        cors: {
            origin: dev ? "http://localhost:3000" : "https://domain.com",
            methods: ["GET", "POST"]
        }
    });

    io.on("connection", (socket) => {
        console.log("연결됨:", socket.id);

        socket.on("register", (userId: string) => {
            userSocketMap.set(userId, socket.id);
            console.log(`사용자 등록: ${userId} → ${socket.id}`);
        });

        socket.on("private_message", async ({ from, to, content }) => {
            const sentAt = new Date();
            const targetSocketId = userSocketMap.get(to);

            try {
                await prisma.message.create({
                    data: {
                        sender: from,
                        receiver: to,
                        content,
                        sentAt,
                        read: !!targetSocketId
                    }
                });
                console.log(`메시지 저장됨: ${from} → ${to}: ${content}`);
            } catch (err) {
                console.error("메시지 저장 실패:", err);
            }

            if (targetSocketId) {
                io.to(targetSocketId).emit("private_message", {
                    from,
                    content,
                    sentAt,
                    read: true
                });
            }

            socket.emit("message_status", {
                to,
                content,
                sentAt,
                read: !!targetSocketId
            });
        });

        socket.on("disconnect", () => {
            for (const [userId, id] of userSocketMap.entries()) {
                if (id === socket.id) {
                    userSocketMap.delete(userId);
                    console.log(`연결 종료: ${userId}`);
                    break;
                }
            }
        });
    });

    expressApp.all(/.*/, (req, res) => {
        return handle(req, res).catch((err) => {
            console.error("Next 핸들링 중 에러:", err);
            res.status(500).end("Internal Server Error");
        });
    });

    const PORT = process.env.PORT || 4000;
    httpServer.listen(PORT, () => {
        console.log(`서버 실행됨: http://localhost:${PORT}`);
    });
});
