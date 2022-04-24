require("dotenv").config();
import express from "express";
import { getRepository } from "typeorm";
import { Profile } from "../entity/Profile";
import { TokenAuthentication } from "../middlewares/TokenAuthentication.middleware";
import { Buffer } from "buffer";
import Avatar from "../entity/Avatar";

const router = express.Router();

//ANCHOR get Home page user info
router.get("/userinfo", TokenAuthentication, async (req, res) => {
  const userId = req.profile.id;
  const profileRepo = getRepository(Profile);
  const userProfile = await profileRepo.findOne({
    where: { id: userId },
    relations: ["user", "avatar"],
  });
  if (!userProfile) {
    return res
      .status(404)
      .json({ success: false, message: "User profile not found!" });
  }
  const avatar = userProfile.avatar
    ? userProfile.avatar.profileImg.toString("base64")
    : "";
  const returnData = {
    showname: userProfile.showname,
    username: userProfile.username,
    email: userProfile.user.email,
    profileImg: avatar,
  };
  return res.status(200).json({ success: true, userInfo: returnData });
});

router.post("/update", TokenAuthentication, async (req, res) => {
  const userId = req.profile.id;
  const { showname, profileImg } = req.body;
  const profileRepo = getRepository(Profile);
  const avatarRepo = getRepository(Avatar);
  const userProfile = await profileRepo.findOne({
    where: { id: userId },
    relations: ["avatar"],
  });
  if (!userProfile) {
    return res
      .status(404)
      .json({ success: false, message: "User profile not found!" });
  }

  userProfile.showname = showname;
  //img dealing ========================================================================
  if (profileImg != "") {
    const imgBuffer = Buffer.from(profileImg, "base64");
    if (userProfile.avatar) {
      //already have avatar ========================================================================
      const oldAvatar = await avatarRepo.findOne({
        where: {
          id: userProfile.avatar.id,
        },
      });
      if (!oldAvatar) {
        return res
          .status(404)
          .json({ success: false, message: "Profile avatar not found!" });
      }
      oldAvatar.profileImg = imgBuffer;
      await avatarRepo.save(oldAvatar);
      userProfile.avatar = oldAvatar;
      await profileRepo.save(userProfile);
      return res.json({ success: true });
    } else {
      //have no avatar ========================================================================
      const newAvatar = new Avatar();
      newAvatar.profileImg = imgBuffer;
      await avatarRepo.save(newAvatar);
      userProfile.avatar = newAvatar;
      await profileRepo.save(userProfile);
    }
    return res.json({ success: true });
  } else {
    //have no img upload ========================================================================
    await profileRepo.save(userProfile);
    return res.json({ success: true });
  }
});

export { router as userRouter };
