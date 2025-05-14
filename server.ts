import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import next from "next";
import dotenv from "dotenv";
import mysql from "mysql2/promise";

dotenv.config();

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const db = mysql.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

const userSocketMap = new Map<string, string>(); // userId -> socket.id

app.prepare().then(() => {
    const expressApp = express();
    const httpServer = createServer(expressApp);

    expressApp.use(express.json());

    // 소켓 서버 초기화
    const io = new Server(httpServer, {
        path: "/socket.io",
        cors: {
            origin: dev ? "http://localhost:3000" : "https://domain.com",
            methods: ["GET", "POST"]
        }
    });

    // 소켓 연결
    io.on("connection", (socket) => {
        console.log("연결됨:", socket.id);

        socket.on("register", (userId: string) => {
            userSocketMap.set(userId, socket.id);
            console.log(`사용자 등록: ${userId} -> ${socket.id}`);
        });

        socket.on("private_message", async ({ from, to, content }) => {
            const targetSocketId = userSocketMap.get(to);


            try {
                await db.query(
                    "INSERT INTO messages (sender, receiver, content) VALUES (?, ?, ?)",
                    [from, to, content]
                );
                console.log(`메시지 저장됨: ${from} → ${to}: ${content}`);
            } catch (err) {
                console.error("DB 저장 실패:", err);
            }

            // 대상에게 메시지 전달
            if (targetSocketId) {
                io.to(targetSocketId).emit("private_message", { from, content });
            } else {
                console.log(`대상 사용자(${to})가 오프라인이거나 등록 안됨`);
            }
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

    // Next.js 처리
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
