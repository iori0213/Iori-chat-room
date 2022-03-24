require('dotenv').config();
import express from "express";
import { getRepository } from "typeorm";
import { FriendShip } from "../entity/FriendShip";
import { Profile } from "../entity/Profile";
import { TokenAuthentication } from "../middlewares/TokenAuthentication.middleware";

const router = express();
//SECTION Add friend
router.post("/add", TokenAuthentication, async (req, res) => {
  //id input
  const userId = req.profile.id;
  const { friendid: friendId } = req.body;
  //check id input
  if (!userId) { return res.json({ success: false, message: "user id input is missing!", line: 14 }) }
  if (!friendId) { return res.json({ success: false, message: "friend id input is missing!", line: 15 }) }
  // Repoes
  const profileRepo = getRepository(Profile);
  const friendShipRepo = getRepository(FriendShip);

  //get user profile
  const userProfile = await profileRepo.findOne({ where: { id: userId }, relations: ["friendShips"] })
  if (!userProfile) { return res.json({ success: false, message: "User profile not exist", line: 23 }) }
  //check if friend profile exist
  const friendProfile = await profileRepo.findOne({ where: { id: friendId }, relations: ["friendShips"] })
  if (!friendProfile) { return res.json({ success: false, message: "friend profile not exist", line: 26 }) }
  //check if friendship already exist
  const friendshipCheck = await friendShipRepo.findOne({ where: { user: userProfile, friend: friendProfile } })
  if (friendshipCheck) { return res.json({ success: false, message: "already is friend", line: 29 }) }
  //create friendship
  //user
  const userFriendShip = new FriendShip()
  userFriendShip.friend = friendProfile
  userFriendShip.user = userProfile
  friendShipRepo.save(userFriendShip)
  //friend
  const friendFriendShip = new FriendShip()
  friendFriendShip.friend = userProfile
  friendFriendShip.user = friendProfile
  friendShipRepo.save(friendFriendShip)
  //return success
  return res.json({ success: true, message: "Add friend success.", line: 42 })
})
//!SECTION 

//SECTION Get friends
router.get("/get", TokenAuthentication, async (req, res) => {
  //user id
  const userId = req.profile.id;
  //repo
  const profileRepo = getRepository(Profile);
  //get and check user profile
  const userProfile = await profileRepo.findOne({ where: { id: userId }, relations: ["friendShips", "friendShips.user", "friendShips.friend"] })
  if (!userProfile) { return res.json({ success: false, message: "user not exist", line: 54 }) }
  //create friendArray to store the friend profile from userProfile.friendShips with map function
  const friendArray = userProfile.friendShips.map(friendShip => friendShip.friend)
  //return success and friendArray
  return res.json({ success: true, message: "Get friendship success.", friendsArray: friendArray, line: 58 })
})
//!SECTION 

//SECTION Remove friend1
router.post("/remove", TokenAuthentication, async (req, res) => {
  //user id and friend id
  const userId = req.profile.id;
  const { friendId } = req.body;
  //repoes
  const friendShipRepo = getRepository(FriendShip);
  //check if friendship exist
  const userFriendShip = await friendShipRepo.findOne({ where: { user: userId, friend: friendId } })
  const friendFriendShip = await friendShipRepo.findOne({ where: { user: friendId, friend: userId } })
  if (!userFriendShip || !friendFriendShip) { return res.json({ success: false, message: "Friendship not found", line: 72 }) }
  //remove friendship
  await friendShipRepo.remove(userFriendShip);
  await friendShipRepo.remove(friendFriendShip);
  //return success
  return res.json({ success: true, message: "friendship removed" })
})
//!SECTION
export { router as friendShipRouter }