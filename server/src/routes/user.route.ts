require('dotenv').config();
import express from "express";
import { getRepository } from "typeorm";
import UserEntity from "../entity/UserEntity";
import { TokenAuthentication } from "../middlewares/TokenAuthentication.middleware";
import Jwt from "jsonwebtoken";


const router = express.Router();

//ANCHOR get Home page user info
router.post("/userinfo", async (req, res) => {
  const getRepo = getRepository(UserEntity);
  const { accessToken } = req.body;
  const userId = Jwt.decode(accessToken)
  const userInfo = await getRepo.findOne({ where: { id: userId } });
  if (!userInfo) return res.status(404).json({ success: false, message: "User not found!" })
  console.log(userInfo);
  return res.status(200).json({ success: true, userInfo: userInfo })
})

// ANCHOR get all user request
router.get("/userInfo", TokenAuthentication, async (req, res) => {
  const getRepo = getRepository(UserEntity);
  getRepo.find({
    select: ["id", "email", "username"],
    where: {
      id: req.user!.id
    }
  })
    .then((data) => {
      return res.json(data);
    }).catch(error => console.log(error))
});




export { router as userRouter }