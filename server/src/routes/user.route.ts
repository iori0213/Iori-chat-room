require('dotenv').config();
import express from "express";
import { getRepository } from "typeorm";
import User from "../entity/User";
import { Authentication } from "../middlewares/Authentication.middleware";


const router = express.Router();

// ANCHOR get all user request
router.get("/userInfo", Authentication, async (req, res) => {
  const getRepo = getRepository(User);
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