require('dotenv').config();
import express from "express";
import { getRepository } from "typeorm";
import { User } from "../entity/User";
import { Authentication } from "../middlewares/Authentication.middleware";


const router = express.Router();

// ANCHOR get all user request
router.get("/", Authentication, async (_req, res) => {
  const getRepo = getRepository(User);
  getRepo.find().then((data) => {
    return res.json(data);
  }).catch(error => console.log(error))
})



export { router as userRouter }