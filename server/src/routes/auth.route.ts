import express from "express";
import { getRepository } from "typeorm";
import { User } from "../entity/User";
import bcrypt from "bcrypt";

const router = express.Router()

// ANCHOR Register function
router.post("/register/", async (req, res) => {
  const { email, username, password } = req.body;
  const getRepo = getRepository(User);

  //check if the user name existed
  const checkUserName = await getRepo.findOne({
    where: {
      username: username
    }
  });
  if (checkUserName) {
    return res
      .status(400)
      .json({
        success: false,
        error: {
          message: 'Username already existed.'
        }
      })
  } else {
    // bcrypt the password
    const hashPassword = await bcrypt.hash(password, 10);
    // insert user into database
    getRepo.insert({
      email: email,
      username: username,
      password: hashPassword,
    })
    return res
      .status(200)
      .json({
        success: true,
        error: {
          message: ''
        }
      })
  }
})

// ANCHOR Login function
// router.post("/login", (req, res) => {
//   const getRepo = getRepository(User);

// })

export { router as authRouter }