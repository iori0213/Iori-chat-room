import express from "express";
import { getRepository } from "typeorm";
import ChatRoom from "../entity/ChatRoom";
import { Profile } from "../entity/Profile";
import UserRoomJoinTable from "../entity/UserRoomJoinTable";
import { TokenAuthentication } from "../middlewares/TokenAuthentication.middleware";

const router = express();

router.get("/list", TokenAuthentication, async (req, res) => {
  //user id
  const userId = req.profile.id;
  //repo
  const profileRepo = getRepository(Profile);
  // Check profile
  const user = await profileRepo.findOne({
    where: { id: userId },
    relations: ["joinTable", "joinTable.chatRoom"],
  });
  //check if user exist
  if (!user) return res.json({ success: false, message: "User not exist!" });
  //organize room list from profile.chatRooms
  const roomListData = user.joinTable.map((joinData) => {
    if (joinData.join) {
      return joinData.chatRoom;
    } else {
      return;
    }
  });
  const roomList = roomListData.filter((room) => room !== undefined);
  return res.json({
    success: true,
    message: "get room list.",
    roomList: roomList.length == 0 ? [] : roomList,
  });
});

router.get("/room/:roomId", async (req, res) => {
  //get room id
  const { roomId } = req.params;
  //repo
  const chatRoomRepo = getRepository(ChatRoom);
  //check if room exist
  const room = await chatRoomRepo.findOne({
    where: { id: roomId },
    relations: ["members"],
  });
  if (!room) {
    return res.json({ success: false, message: "room not found!" });
  }
  //return success and room data
  return res.json({
    success: true,
    message: `get room success`,
    chatRoom: room,
  });
});

router.post("/quit", TokenAuthentication, async (req, res) => {
  const userId = req.profile.id;
  const { roomId } = req.body;

  const joinTableRepo = getRepository(UserRoomJoinTable);
  const joinTable = await joinTableRepo.findOne({
    where: {
      profile: userId,
      chatRoom: roomId,
    },
  });
  if (!joinTable) {
    return res.json({ success: false, message: "join table not fount" });
  }
  joinTable.join = false;
  await joinTableRepo.save(joinTable);
  return res.json({ success: true, message: "Quit room" });
});

export { router as chatRoomRouter };
