import { Server, Socket } from "socket.io";
import { getRepository } from "typeorm";
import ChatRoom from "../entity/ChatRoom";
import Message from "../entity/Message";
import { Profile } from "../entity/Profile";

export const chatController = (
  io: Server,
  socket: Socket,
  profile: Profile,
  room: ChatRoom
) => {
  const sendMsg = async (params: { msg: string }) => {
    const { msg } = params;
    if (!msg) {
      socket.emit("error-msg", {
        message: "no msg reveive",
      });
    } else {
      const msgRepo = getRepository(Message);
      const newMsg = new Message();
      newMsg.room = room;
      newMsg.sender = profile;
      newMsg.msg = msg;
      await msgRepo.save(newMsg);
      const addMsg = new Message();
      addMsg.id = newMsg.id;
      addMsg.sender = newMsg.sender;
      addMsg.msg = newMsg.msg;
      addMsg.createdAt = newMsg.createdAt;
      console.log(addMsg);
      io.to(room.id).emit("add-msg", addMsg);
    }
  };
  socket.on("send-msg", sendMsg);

  const deleteMsg = async (params: { id: number }) => {
    const { id } = params;
    const msgRepo = getRepository(Message);
    const msg = await msgRepo.findOne({
      where: { id: id, sender: { id: profile.id } },
    });
    if (!msg) {
      socket.emit(
        "error-msg",
        "You don't own the message, or message not exist!"
      );
    } else {
      io.in(room.id).emit("remove-msg", msg.id);
      await msgRepo.remove(msg);
    }
  };
  socket.on("delete-msg", deleteMsg);

  const editMsg = async (params: { id: string; msg: string }) => {
    const { id, msg } = params;
    const msgRepo = getRepository(Message);
    const msgData = await msgRepo.findOne({
      where: { id: id },
    });
    if (!msgData) {
      return socket.emit("error-msg", "message not found");
    }
    msgData.msg = msg;
    return socket
      .in(room.id)
      .emit("update-msg", { id: msgData.id, msg: msgData.msg });
  };
  socket.on("edit-msg", editMsg);

  return () => {
    socket.off("send-msg", sendMsg);
    socket.off("delete-msg", deleteMsg);
    socket.off("edit-msg", editMsg);
  };
};
