import { Server, Socket } from "socket.io";
import { getRepository } from "typeorm";
import ChatRoom from "../entity/ChatRoom";
import Message from "../entity/Message";
import { Profile } from "../entity/Profile";

export const chatController = (
  io: Server,
  socket: Socket,
  profile: Profile,
  room: ChatRoom,
) => {
  socket.on("send-msg", async (params: { msg: string }) => {
    const { msg } = params;
    const msgRepo = getRepository(Message);
    const newMsg = new Message();
    newMsg.room = room;
    newMsg.sender = profile;
    newMsg.msg = msg;
    await msgRepo.save(newMsg);
    console.log({ newMsg });
    io.to(room.id).emit("add-msg", { msg: msg })
  });

  socket.on("delete-msg", async (params: { id: number }) => {
    const { id } = params;
    const msgRepo = getRepository(Message);
    const msg = await msgRepo.findOne({ where: { id: id } })
    if (!msg) {
      console.log("error: massage not found!")
      socket.emit("error", {
        message: "message not found!"
      })
    } else {
      msgRepo.remove(msg);
      io.in(room.id).emit("remove-msg", { id: msg.id });
    }
  })
};
