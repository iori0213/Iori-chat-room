import { Server, Socket } from "socket.io";
import { getRepository } from "typeorm";
import ChatRoom from "../entity/ChatRoom";
import { Profile } from "../entity/Profile";
import { chatController } from "./chat";

export const roomController = (
  io: Server,
  socket: Socket,
  profile: Profile
) => {
  socket.on("join-room", async (params: { roomId: string }) => {
    console.log({ params });
    const { roomId } = params
    const roomRepo = getRepository(ChatRoom);
    const room = await roomRepo.findOne({ where: { id: roomId }, relations: ["members"] });
    if (!room) {
      console.log("room id not exist");
      socket.emit("error", {
        message: "room id not exist"
      })
    } else if (!room.members.some((member) => member.id === profile.id)) {
      console.log("user is not belong to the room");
      socket.emit("error", {
        message: "user is not belong to the room"
      })
    } else {
      console.log("joined!")
      socket.join(roomId);
      socket.to(roomId).emit("joined room", { Profile: profile })
      chatController(io, socket, profile, room);
      //leave room process
      socket.on("leave-room", () => {
        console.log("leave room process")
        socket.leave(roomId);
      })
    }
  });


}