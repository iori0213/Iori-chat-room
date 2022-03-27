import { Server, Socket } from "socket.io";
import { getRepository } from "typeorm";
import ChatRoom from "../entity/ChatRoom";
import Message from "../entity/Message";
import { Profile } from "../entity/Profile";
import { chatController } from "./chat";

export const roomController = (
  io: Server,
  socket: Socket,
  profile: Profile
) => {
  socket.on("join-room", async (params: { roomId: string }) => {
    console.log({ params });
    const { roomId } = params;
    const roomRepo = getRepository(ChatRoom);
    const room = await roomRepo.findOne({
      where: { id: roomId },
      relations: ["members", "messages"],
    });
    const messages = await getRepository(Message).find({
      where: { room },
      order: {
        createdAt: "DESC",
      },
      take: 10,
    });
    if (!room) {
      console.log("room id not exist");
      socket.emit("error", {
        message: "room id not exist",
      });
    } else if (!room.members.some((member) => member.id === profile.id)) {
      console.log("user is not belong to the room");
      socket.emit("error", {
        message: "user is not belong to the room",
      });
    } else {
      console.log("joined!");
      socket.join(roomId);
      socket.emit("join-room-initialize", {
        chatRoomId: room.id,
        chatRoomName: room.roomname,
        chatRoomMembers: room.members,
        chatRoomMessages: messages,
      });
      socket.to(roomId).emit("joined room", { Profile: profile });
      chatController(io, socket, profile, room);
      //add new member to chat room
      socket.on("add-member", async (params: { id: string }) => {
        const { id } = params;
        const profileRepo = getRepository(Profile);
        const newMember = await profileRepo.findOne({ where: { id: id } });
        if (!newMember) {
          socket.emit("error", {
            message: "User not found",
          });
        } else {
          room.members.push(newMember);
          await roomRepo.save(room);
          io.in(roomId).emit("add-member-cli", { profile: newMember });
        }
      });
      //
      //leave room process
      socket.on("leave-room", () => {
        console.log("leave room process");
        socket.leave(roomId);
      });
    }
  });
};
