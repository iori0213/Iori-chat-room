import { Server, Socket } from "socket.io";
import { getRepository, In } from "typeorm";
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
      relations: ["sender"],
      take: 15,
    });
    if (!room) {
      console.log("room id not exist");
      socket.emit("error-msg", {
        message: "room id not exist",
      });
    } else if (!room.members.some((member) => member.id === profile.id)) {
      console.log("user is not belong to the room");
      socket.emit("error-msg", {
        message: "user is not belong to the room",
      });
    } else {
      console.log("joined!");
      socket.join(roomId);
      const msgs = messages.map((msg) => {
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
      socket.emit("join-room-initialize", {
        members: room.members,
        msgs: msgs,
      });
      socket.to(roomId).emit("joined room", { Profile: profile });
      //leave chat socket off function
      const leaveChat = chatController(io, socket, profile, room);
      //add new member to chat room
      socket.on("add-member", async (params: { id: string }) => {
        const { id } = params;
        const profileRepo = getRepository(Profile);
        const newMember = await profileRepo.findOne({ where: { id: id } });
        if (!newMember) {
          socket.emit("error-msg", {
            message: "User not found",
          });
        } else {
          room.members.push(newMember);
          await roomRepo.save(room);
          io.in(roomId).emit("add-member-cli", { profile: newMember });
        }
      });
      //quite room
      socket.on("quite-room", async (params: { id: string }) => {
        const { id } = params;
        const profileRepo = getRepository(Profile);
        const userProfile = await profileRepo.findOne({ where: { id: id } });
        if (!userProfile) {
          socket.emit("error-msg", {
            message: "User not found!",
          });
        } else {
          room.members.filter((member) => member != userProfile);
          roomRepo.save(room);
        }
      });
      //leave room process
      socket.on("leave-room", () => {
        console.log("leave room process");
        socket.leave(roomId);
        leaveChat();
      });
    }
  });
  socket.on(
    "create-room",
    async (params: { roomName: string; members: string[] }) => {
      //input params
      const { roomName, members } = params;
      //repoes
      const profileRepo = getRepository(Profile);
      const roomRepo = getRepository(ChatRoom);
      const roomMembers: Profile[] = await profileRepo.find({
        where: { id: In(members) },
      });
      const newRoom = new ChatRoom();
      newRoom.members = [profile, ...roomMembers];
      newRoom.roomname = roomName;
      await roomRepo.save(newRoom);
      io.emit("new-room", {
        members: newRoom.members.map((member: Profile) => member.id),
      });
    }
  );
};
