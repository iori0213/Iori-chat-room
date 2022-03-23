require('dotenv').config();
import express from "express";
import { getRepository } from "typeorm";
import { FriendShip } from "../entity/FriendShip";
import { Profile } from "../entity/Profile";
import { TokenAuthentication } from "../middlewares/TokenAuthentication.middleware";

const router = express();
//SECTION Add friend
router.post("/add", TokenAuthentication, async (req, res) => {
  //check id input
  const userid = req.profile.id;
  const { friendid } = req.body;
  if (!userid) { return res.json({ success: false, message: "user id input is missing!", line: 13 }) }
  if (!friendid) { return res.json({ success: false, message: "friend id input is missing!", line: 14 }) }

  // Repoes
  const profileRepo = getRepository(Profile);
  const friendShipRepo = getRepository(FriendShip);

  //get user profile
  const userProfile = await profileRepo.findOne({ where: { id: userid }, relations: ["friendShips"] })
  if (!userProfile) { return res.json({ success: false, message: "User profile not exist", line: 20 }) }
  //check if friend rpofile exist
  const friendProfile = await profileRepo.findOne({ where: { id: friendid }, relations: ["friendShips"] })
  if (!friendProfile) { return res.json({ success: false, message: "friend profile not exist", line: 23 }) }

  const friendshipCheck = await friendShipRepo.findOne({ where: { user: userProfile, friend: friendProfile } })
  if (friendshipCheck) { return res.json({ success: false, message: "already is friend" }) }
  //user
  const userFriendShip = new FriendShip()
  userFriendShip.friend = friendProfile
  userFriendShip.user = userProfile
  friendShipRepo.save(userFriendShip)
  userProfile.friendShips.push(userFriendShip)
  console.log("USER:", userProfile.friendShips);
  profileRepo.save(userProfile)
  //friend
  const friendFriendShip = new FriendShip()
  friendFriendShip.friend = userProfile
  friendFriendShip.user = friendProfile
  friendShipRepo.save(friendFriendShip)
  friendProfile.friendShips.push(friendFriendShip);
  profileRepo.save(friendProfile)


  return res.json({ success: true, message: "Add friend success.", line: 32 })
})
//!SECTION 

//SECTION Get friends
router.post("/get", TokenAuthentication, async (req, res) => {
  //test
  console.log(req.body.test);
  const userid = req.profile.id;
  const profileRepo = getRepository(Profile);
  const userProfile = await profileRepo.findOne({ where: { id: userid }, relations: ["friendShips", "friendShips.user", "friendShips.friend"] })
  if (!userProfile) { return res.json({ success: false, message: "user not exist", line: 58 }) }
  const friendArray: Profile[] = [];
  userProfile.friendShips.map((friend_ship) => {
    friendArray.push(friend_ship.friend)
  })
  return res.json({ success: true, message: "Get friendship success.", friendsArray: friendArray })
})
//!SECTION 
export { router as friendShipRouter }