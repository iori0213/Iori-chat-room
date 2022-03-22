require('dotenv').config();
import express from "express";
import { getRepository } from "typeorm";
import { FriendShip } from "../entity/FriendShip";
import { Profile } from "../entity/Profile";
import { TokenAuthentication } from "../middlewares/TokenAuthentication.middleware";

const router = express();

router.post("/add", TokenAuthentication, async (req, res) => {
  console.log('Adding Friend')
  //check id input
  const userid = req.profile.id;
  const { friendid } = req.body;
  if (!userid) { return res.json({ success: false, message: "user id input is missing!", line: 13 }) }
  if (!friendid) { return res.json({ success: false, message: "friend id input is missing!", line: 14 }) }

  // Repoes
  const profileRepo = getRepository(Profile);
  const friendShipRepo = getRepository(FriendShip);

  //get user profile
  const userProfile = await profileRepo.findOne({ where: { id: userid } })
  if (!userProfile) { return res.json({ success: false, message: "User profile not exist", line: 20 }) }
  //check if friend rpofile exist
  const friendProfile = await profileRepo.findOne({ where: { id: friendid } })
  if (!friendProfile) { return res.json({ success: false, message: "friend profile not exist", line: 23 }) }

  const userFriendShip = new FriendShip()
  userFriendShip.friend = friendProfile
  userFriendShip.user = userProfile
  friendShipRepo.save(userFriendShip)


  const friendFriendShip = new FriendShip()
  friendFriendShip.friend = userProfile
  friendFriendShip.user = friendProfile

  friendShipRepo.save(friendFriendShip)


  return res.json({ success: true, message: "Add friend success.", line: 32 })
})
export { router as friendShipRouter }