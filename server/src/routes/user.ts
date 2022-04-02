require("dotenv").config();
import express from "express";
import { getRepository } from "typeorm";
import User from "../entity/User";
import { TokenAuthentication } from "../middlewares/TokenAuthentication.middleware";

const router = express.Router();

//ANCHOR get Home page user info
router.get("/userinfo", TokenAuthentication, async (req, res) => {
  const userId = req.profile.id;
  const getRepo = getRepository(User);
  const userInfo = await getRepo.findOne({
    select: [],
    where: { id: userId },
  });
  if (!userInfo)
    return res.status(404).json({ success: false, message: "User not found!" });
  console.log(userInfo);
  return res.status(200).json({ success: true, userInfo: userInfo });
});

export { router as userRouter };
