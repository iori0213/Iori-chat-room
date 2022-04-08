require("dotenv").config();
import express from "express";
import { getRepository } from "typeorm";
import { Profile } from "../entity/Profile";
import { TokenAuthentication } from "../middlewares/TokenAuthentication.middleware";
import { Buffer } from "buffer";

const router = express.Router();

// const profileImagePath = "../image/profile";

//ANCHOR get Home page user info
router.get("/userinfo", TokenAuthentication, async (req, res) => {
  const userId = req.profile.id;
  const profileRepo = getRepository(Profile);
  const userProfile = await profileRepo.findOne({
    where: { id: userId },
    relations: ["user"],
  });
  if (!userProfile) {
    return res
      .status(404)
      .json({ success: false, message: "User profile not found!" });
  }
  const avatar = userProfile.profileImg
    ? userProfile.profileImg.toString("base64")
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
  const userProfile = await profileRepo.findOne({
    where: { id: userId },
  });
  if (!userProfile) {
    return res
      .status(404)
      .json({ success: false, message: "User profile not found!" });
  }

  //img dealing ========================================================================
  const imgBuffer = Buffer.from(profileImg, "base64");
  userProfile.showname = showname;
  if (profileImg != "") {
    console.log();
    userProfile.profileImg = imgBuffer;
  }

  await profileRepo.save(userProfile);
  return res.json({ success: true });
});

export { router as userRouter };
