require("dotenv").config();
import express from "express";
import { getRepository } from "typeorm";
import Avatar from "../entity/Avatar";
import { FriendShip } from "../entity/FriendShip";
import { Profile } from "../entity/Profile";
import { TokenAuthentication } from "../middlewares/TokenAuthentication.middleware";
import { ProfileWithImg } from "../types/types";

const router = express();

const Bto64 = (avatar: Avatar | undefined) => {
  return avatar ? avatar.profileImg.toString("base64") : "";
};
const profileToProfileWithImg = (inputProfile: Profile) => {
  const newProfile: ProfileWithImg = {
    id: inputProfile.id,
    username: inputProfile.username,
    showname: inputProfile.showname,
    profileImg: Bto64(inputProfile.avatar),
  };
  return newProfile;
};

//SECTION Get friends
router.get("/get", TokenAuthentication, async (req, res) => {
  const userId = req.profile.id;
  const profileRepo = getRepository(Profile);
  const friendShipRepo = getRepository(FriendShip);
  const userProfile = await profileRepo.findOne({ where: { id: userId } });
  if (!userProfile) {
    return res.json({ success: false, message: "User not found" });
  }
  const friendShips = await friendShipRepo.find({
    where: [{ user: userProfile.id }, { friend: userProfile.id }],
    relations: ["user", "user.avatar", "friend", "friend.avatar"],
  });
  const friendList: ProfileWithImg[] = [];
  const userRequestList: ProfileWithImg[] = [];
  const friendRequestList: ProfileWithImg[] = [];
  friendShips.forEach((friendship) => {
    //organize friend list
    if (friendship.active === true) {
      if (friendship.user.id == userProfile.id) {
        friendList.push(profileToProfileWithImg(friendship.friend));
      } else if (friendship.friend.id == userProfile.id) {
        friendList.push(profileToProfileWithImg(friendship.user));
      }
      //start organize request
    } else {
      if (friendship.user.id == userProfile.id) {
        userRequestList.push(profileToProfileWithImg(friendship.friend));
      }
      if (friendship.friend.id == userProfile.id) {
        friendRequestList.push(profileToProfileWithImg(friendship.user));
      }
    }
  });
  console.log("userId:", userProfile.id);
  console.log("friend ships:", friendShips);
  return res.json({
    friendList: friendList,
    userRequestList: userRequestList,
    friendRequestList: friendRequestList,
  });
});
//!SECTION

export { router as friendShipRouter };
