import "reflect-metadata";
import express from "express";
import cors from "cors";
import { createConnection } from "typeorm";
import { userRouter } from "./routes/user";
import { authRouter } from "./routes/auth";
import { friendShipRouter } from "./routes/friendShip";
//socket.io
import { createServer } from "http";
import { Server } from "socket.io";
import { socketController } from "./socket/socketController";
import { chatRoomRouter } from "./routes/chatRoom";

const PORT = process.env.PORT || 5000;
const app = express();

const httpServer = createServer(app);
const io = new Server(httpServer, {});

app.use(cors());
app.use(express.json());

const main = () => {
  createConnection()
    .then(async () => {
      app.use("/api/v1/user", userRouter);
      app.use("/api/v1/auth", authRouter);
      app.use("/api/v1/friendship", friendShipRouter)
      app.use("/api/v1/chatroom", chatRoomRouter)
      io.on('connection', socket => {
        console.log("socket connected")
        socketController(io, socket)
      })
      httpServer.listen(PORT, () => console.log(`Runing On ${PORT}`))
    })
    .catch(error => console.log(error))
}

main();