import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import next from "next";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    const expressApp = express();
    const httpServer = createServer(expressApp);

    expressApp.use(express.json());

    expressApp.post("/submit", (req, res) => {
        console.log("받은 POST:", req.body);
        res.json({ status: "ok", received: req.body });
    });

    const io = new Server(httpServer, {
        path: "/socket.io",
        cors: {
            origin: "*",
        },
    });

    io.on("connection", (socket) => {
        console.log("Client connected:", socket.id);

        socket.on("message", (msg: string) => {
            console.log("Received:", msg);
            socket.emit("message", `Server received: ${msg}`);
        });

        socket.on("disconnect", () => {
            console.log("Client disconnected:", socket.id);
        });
    });

    expressApp.use((req, res) => {
        handle(req, res).catch((err) => {
            console.error("Error handling request:", err);
            res.status(500).end("Internal Server Error");
        });
    });

    const PORT = 4000;
    httpServer.listen(PORT, () => {
        console.log(`Server ready at http://localhost:${PORT}`);
    });
});
