import { Server, Socket } from "socket.io";
import { getRepository, In } from "typeorm";
import ChatRoom from "../entity/ChatRoom";
import Message from "../entity/Message";
import { Profile } from "../entity/Profile";
import UserRoomJoinTable from "../entity/UserRoomJoinTable";
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
    const joinTableRepo = getRepository(UserRoomJoinTable);
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
      //join the room success
      console.log("joined!");
      socket.join(roomId);

      //initialize process
      const joinTableRoomMemberData = await joinTableRepo.find({
        where: {
          chatRoom: room.id,
        },
        relations: ["profile", "profile.avatar"],
      });
      const roomMembers = joinTableRoomMemberData.map((data) => {
        const avatar = data.profile.avatar
          ? data.profile.avatar.profileImg.toString("base64")
          : "";
        return {
          id: data.profile.id,
          username: data.profile.username,
          showname: data.profile.showname,
          profileImg: avatar,
          joinStatus: data.join,
        };
      });
      socket.emit("join-room-initialize", {
        members: roomMembers,
        msgs: messages,
      });
      socket.to(roomId).emit("joined room", { Profile: profile });
      //leave chat socket off function
      const leaveChat = chatController(io, socket, profile, room);
      //add new member to chat room
      const addMember = async (params: { members: string[] }) => {
        const { members } = params;
        console.log(members);
        const profileRepo = getRepository(Profile);
        const joinTableRepo = getRepository(UserRoomJoinTable);
        const membersProfile = await profileRepo.find({
          where: {
            id: In(members),
          },
          relations: ["avatar"],
        });
        membersProfile.map(async (profile) => {
          const joinTableCheck = await joinTableRepo.findOne({
            where: {
              profile: profile.id,
              chatRoom: room.id,
            },
          });
          if (joinTableCheck) {
            joinTableCheck.join = true;
            await joinTableRepo.save(joinTableCheck);
          } else {
            room.members.push(profile);
            const newJoinTable = new UserRoomJoinTable();
            newJoinTable.profile = profile;
            newJoinTable.chatRoom = room;
            await joinTableRepo.save(newJoinTable);
          }
        });
        await roomRepo.save(room);
        //process the send back data
        const newMembersData = membersProfile.map((profile) => {
          const avatar = profile.avatar
            ? profile.avatar.profileImg.toString("base64")
            : "";
          return {
            id: profile.id,
            username: profile.username,
            showname: profile.showname,
            profileImg: avatar,
            joinStatus: true,
          };
        });
        io.in(roomId).emit("add-member-cli", { newMembers: newMembersData });
        io.emit("addMember-new-room", {
          newMembersId: members,
        });
      };
      socket.on("add-member", addMember);
      //leave room process
      socket.on("leave-room", () => {
        console.log("leave room process");
        socket.off("add-member", addMember);
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
      const joinTableRepo = getRepository(UserRoomJoinTable);
      const roomMembers: Profile[] = await profileRepo.find({
        where: { id: In(members) },
      });
      //create a new chatroom
      const newRoom = new ChatRoom();
      newRoom.members = [profile, ...roomMembers];
      newRoom.roomname = roomName;
      await roomRepo.save(newRoom);
      //use both profile and chatroom data to create a joinTable
      await Promise.all(
        newRoom.members.map(async (member) => {
          const newJoinTable = new UserRoomJoinTable();
          newJoinTable.chatRoom = newRoom;
          newJoinTable.profile = member;
          await joinTableRepo.save(newJoinTable);
        })
      );
      io.emit("new-room", {
        members: newRoom.members.map((member: Profile) => member.id),
      });
    }
  );
};
