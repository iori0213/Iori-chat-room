require('dotenv').config();
import express from "express";
import { getRepository } from "typeorm";
import { User } from "../entity/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router()

// ANCHOR Register function
router.post("/register/", async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const getRepo = getRepository(User);
    //ANCHOR Register - Find is the email existed
    const checkEmail = await getRepo.findOne({
      where: {
        email: email
      }
    });
    //ANCHOR Register - 1 Filter: check email
    if (checkEmail) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Email already existed!"
        })
    } else {
      //ANCHOR Register - 2 Filter: check username
      const checkUsername = await getRepo.findOne({
        where: {
          username: username
        }
      })
      if (checkUsername) {
        return res
          .status(400)
          .json({
            success: false,
            message: "Username already existed!"
          })
      } else {
        //ANCHOR Register - Success data insert
        // bcrypt the password
        const hashedPassword = await bcrypt.hash(password, 10);
        // insert user into database
        const newUser = new User();
        newUser.email = email;
        newUser.username = username;
        newUser.password = hashedPassword;
        getRepo.save(newUser);
        return res
          .status(200)
          .json({
            success: true,
            message: "Register success!"
          })
      }
    }
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .send("Register : Something is broken!")
  }
})

// ANCHOR Login function
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const getRepo = getRepository(User);
    //ANCHOR Login - Find is the enail existed
    const userCheck = await getRepo.findOne({
      where: {
        email: email
      }
    })
    // ANCHOR Login - 1 filter: Email validation
    if (userCheck) {
      const validPassword = await bcrypt.compare(password, userCheck.password)
      // ANCHOR Login - 2 filter : Password validation
      if (validPassword) {
        //ANCHOR Login - Success sending JWT
        // Create a plaintext payload for the JWT
        const userInform = {
          id: userCheck.id,
          email: userCheck.email,
          username: userCheck.username
        }
        const accessToken = jwt.sign(userInform, process.env.ACCESS_TOKEN_SECRET!);
        res
          .status(200)
          .json({
            success: true,
            message: "Valid email and password!",
            accessToken: accessToken,
          })
      } else {
        res
          .status(400)
          .json({
            success: false,
            message: "Wrong password!"
          })
      }
    } else {
      res
        .status(400)
        .json({
          success: false,
          message: "User not found!"
        })
    }
  } catch (e) {
    console.log(e)
    res.status(500).send("Login: Something is broken!")
  }
})

export { router as authRouter }