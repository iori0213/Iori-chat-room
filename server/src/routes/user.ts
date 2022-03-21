require('dotenv').config();
import express from "express";
import { getRepository } from "typeorm";
import User from "../entity/User";
// import { TokenAuthentication } from "../middlewares/TokenAuthentication.middleware";
import Jwt from "jsonwebtoken";


const router = express.Router();

//ANCHOR get Home page user info
router.post("/userinfo", async (req, res) => {
  const getRepo = getRepository(User);
  const { accessToken } = req.body;
  const userId = Jwt.decode(accessToken)
  const userInfo = await getRepo.findOne({
    select: [],
    where: { id: userId },
    relations: ["friends"]
  });
  if (!userInfo) return res.status(404).json({ success: false, message: "User not found!" })
  console.log(userInfo);
  return res.status(200).json({ success: true, userInfo: userInfo })
})

// ANCHOR get all user request
// router.get("/userInfo", TokenAuthentication, async (req, res) => {
//   const getRepo = getRepository(User);
//   getRepo.find({
//     select: ["id", "email", "name", "friends"],
//     where: {
//       id: req.user!.id
//     },
//     relations: ["FriendList"]
//   })
//     .then((data) => {
//       return res.json(data);
//     }).catch(error => console.log(error))
// });




export { router as userRouter }