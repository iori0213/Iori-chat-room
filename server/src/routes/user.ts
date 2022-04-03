require("dotenv").config();
import express from "express";
import { getRepository } from "typeorm";
import { Profile } from "../entity/Profile";
import { TokenAuthentication } from "../middlewares/TokenAuthentication.middleware";

const router = express.Router();

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
  const returnData = {
    showname: userProfile.showname,
    username: userProfile.username,
    email: userProfile.user.email,
  };
  return res.status(200).json({ success: true, userInfo: returnData });
});

export { router as userRouter };
