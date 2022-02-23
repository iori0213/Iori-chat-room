import express from "express";
import { getRepository } from "typeorm";
import { User } from "../entity/User";

const router = express.Router();

// ANCHOR get all user request
router.get("/", async (_, res) => {
  const getRepo = getRepository(User);
  getRepo.find().then((data) => {
    return res.json(data);
  }).catch(error => console.log(error))
})

// router.post("/", async (_, res) => {
//   const getRepo = getRepository(User);
//   getRepo.insert({
//     userName: "Brayn",
//     age: 24
//   });
//   return res.json();
// })

export { router as userRouter }