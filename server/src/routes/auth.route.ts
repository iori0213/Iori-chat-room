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
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const getRepo = getRepository(User);
    // Find is the enail existed
    const userCheck = await getRepo.findOne({
      where: {
        email: email
      }
    })
    // ANCHOR First filter: Email validation
    if (userCheck) {
      const validPassword = await bcrypt.compare(password, userCheck.password)
      // ANCHOR Second filter : Password validation
      if (validPassword) {
        res
          .status(200)
          .json({
            success: true,
            message: "Valid email and password!"
          })
      } else {
        res.json({
          success: false,
          error: {
            message: 'Wrong password!'
          }
        })
      }
    } else {
      res.status(404)
        .json({
          message: "User not found!"
        })
    }
  } catch (e) {
    console.log(e)
    res.status(500).send("Something is broken!")
  }
})

export { router as authRouter }