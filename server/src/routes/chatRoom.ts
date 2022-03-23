import express from "express";
import { getRepository, In } from "typeorm";
import ChatRoom from "../entity/ChatRoom";
import { Profile } from "../entity/Profile";
import { TokenAuthentication } from "../middlewares/TokenAuthentication.middleware";

const router = express();

router.post("/create", TokenAuthentication, async (req, res) => {
  const userId = req.profile.id;
  const { roomName, users } = req.body;
  // Repoes
  const profileRepo = getRepository(Profile);
  const chatRoomRepo = getRepository(ChatRoom);
  // Check user
  const user = await profileRepo.findOne({ where: { id: userId } })
  if (!user) { return res.json({ success: false, message: 'User not Found', line: 29 }) }
  //create new room
  const newRoom = new ChatRoom();
  newRoom.roomname = roomName;
  //getting all the user profile in users array
  const _users = await profileRepo.find({ where: { id: In(users) } })
  //add creater profile to _users array
  _users.push(user)
  newRoom.members = _users;
  await chatRoomRepo.save(newRoom);
  console.log({ newRoom });
  return res.json({ success: true, message: "create room success", chatroom: newRoom })
})

// router.get('/list', async (req, res) => {
// 	const userId = req.profile.id;
//   const profileRepo = getRepository(Profile);
//   const chatRoomRepo = getRepository(ChatRoom);

//   // Check user
//   const user = profileRepo.findOne({
//     where: {
//       id: userId
//     },
// 		relations: ["chatroom"]
//   })
//   if (!user) {
//     return res.json({
//       success: false,
//       error: {
//         message: 'User not Found'
//       }
//     })
//   }

// })

export { router as chatRoomRouter }