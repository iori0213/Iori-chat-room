import express from "express";
import { getRepository, In } from "typeorm";
import ChatRoom from "../entity/ChatRoom";
import { Profile } from "../entity/Profile";
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
    relations: ["chatRooms"],
  });
  //check if user exist
  if (!user) return res.json({ success: false, message: "User not exist!" });
  //organize room list from profile.chatRooms
  const roomList = user.chatRooms.map((room) => room);
  return res.json({
    success: true,
    message: "get room list.",
    roomList: roomList,
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

export { router as chatRoomRouter };
