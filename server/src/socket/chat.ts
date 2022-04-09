import { Server, Socket } from "socket.io";
import { getRepository, LessThanOrEqual, Not } from "typeorm";
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
      const profileImgString = !newMsg.sender.profileImg
        ? ""
        : newMsg.sender.profileImg.toString("base64");
      const addMsg = {
        id: newMsg.id,
        room: newMsg.room,
        msg: newMsg.msg,
        createdAt: newMsg.createdAt,
        sender: {
          id: newMsg.sender.id,
          username: newMsg.sender.username,
          showname: newMsg.sender.showname,
          profileImg: profileImgString,
        },
      };
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
    await msgRepo.save(msgData);
    return io
      .in(room.id)
      .emit("update-msg", { id: msgData.id, msg: msgData.msg });
  };
  socket.on("edit-msg", editMsg);

  const getMoreMsg = async (params: { msg: Message }) => {
    const { msg } = params;
    const msgRepo = getRepository(Message);
    const newMsgs = await msgRepo.find({
      where: {
        room: room,
        id: Not(msg.id),
        createdAt: LessThanOrEqual(msg.createdAt),
      },
      relations: ["sender"],
      order: {
        createdAt: "DESC",
      },
      take: 5,
    });
    const returnMsgs = newMsgs.map((msg) => {
      const profileImgString = !msg.sender.profileImg
        ? ""
        : msg.sender.profileImg.toString("base64");
      return {
        id: msg.id,
        room: msg.room,
        msg: msg.msg,
        createdAt: msg.createdAt,
        sender: {
          id: msg.sender.id,
          username: msg.sender.username,
          showname: msg.sender.showname,
          profileImg: profileImgString,
        },
      };
    });
    if (newMsgs.length < 5) {
      return socket.emit("add-more-msg", {
        newMsgs: newMsgs,
        notify: "This is the begin of this chat room",
      });
    }
    return socket.emit("add-more-msg", { newMsgs: returnMsgs });
  };
  socket.on("get-more-msg", getMoreMsg);

  return () => {
    socket.off("send-msg", sendMsg);
    socket.off("delete-msg", deleteMsg);
    socket.off("edit-msg", editMsg);
    socket.off("get-more-msg", getMoreMsg);
  };
};
