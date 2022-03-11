require('dotenv').config();
import express from "express";
import { getRepository } from "typeorm";
import User from "../entity/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { refreshTokenInterface } from "../constInterface/authUserInterface"

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
router.post("/login/", async (req, res) => {
  try {
    const { email, password } = req.body;
    const getRepo = getRepository(User);
    //ANCHOR Login - Find is the enail existed
    const userCheck = await getRepo.findOne({
      select: ["id", "password", "refreshToken"],
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
          id: userCheck.id
        }
        const accessToken = jwt.sign(userInform, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: "30s" });
        const refreshToken = jwt.sign(userInform, process.env.REFRESH_TOKEN_SECRET!, { expiresIn: "10m" });
        // //add new refreshToken to databse
        let newRefreshToken: string[] = userCheck.refreshToken;
        if (!newRefreshToken) {
          newRefreshToken = [refreshToken];
          await getRepo.save({
            id: userCheck.id,
            refreshToken: newRefreshToken,
          })
        } else {
          newRefreshToken.push(refreshToken)
          await getRepo.update({ refreshToken: newRefreshToken }, { id: userCheck.id })
        }
        res
          .status(200)
          .json({
            success: true,
            message: "Valid email and password!",
            accessToken: accessToken,
            refreshToken: refreshToken,
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

router.post("/token/access", async (req, res) => {
  //check if the req.headers["authorization"] exist
  if (!req.headers["authorization"]) {
    return res.
      status(400)
      .json({
        success: false,
        message: "Error : Missing Authorization Header provided!"
      })
  }

  const authHeader: string = req.headers["authorization"];
  // //getting authMethod and accessToken from the authHeader
  const authMethod: string = authHeader.split(" ")[0]; //authMethod == Bearer
  const accessToken: string = authHeader.split(" ")[1];

  //check is the authMethod & accessToken exist and the is method correct
  if (!authMethod || !accessToken) {
    return (res
      .status(400)
      .json({
        success: false,
        message: "Error : Invalid auth header!"
      })
    )
  }
  else if (authMethod !== "Bearer") {
    return (res
      .status(400)
      .json({
        success: false,
        message: "Error : Invalid auth method!"
      })
    )
  }
  //verify accessToken
  jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET!, (err) => {
    if (err) {
      return res.json({ success: false, message: "AccessToken is expired!" })
    }
    return res.json({ success: true, message: "AccessToken is valid." })
  });
  return (res.json({ success: false, message: "this is the bottom, something went wrong!" }))
})

router.post("/token/refresh", async (req, res) => {
  //check if the req.headers["authorization"] exist
  if (!req.headers["authorization"]) {
    return res.
      status(400)
      .json({
        success: false,
        message: "Error : Missing Authorization Header provided!"
      })
  }

  const authHeader: string = req.headers["authorization"];
  // //getting authMethod and accessToken from the authHeader
  const authMethod: string = authHeader.split(" ")[0]; //authMethod == Bearer
  const refreshToken: string = authHeader.split(" ")[1];

  //check is the authMethod & accessToken exist and the is method correct
  if (!authMethod || !refreshToken) {
    return (res
      .status(400)
      .json({
        success: false,
        message: "Error : Invalid auth header!"
      })
    )
  }
  else if (authMethod !== "Bearer") {
    return (res
      .status(400)
      .json({
        success: false,
        message: "Error : Invalid auth method!"
      })
    )
  }


  //verify refreshToken==========================================================
  const refreshTokenVerify = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!);
  if (!refreshTokenVerify) { return res.json({ success: false, message: "Error : Refresh token invalid" }) }
  //take the userId from the refreshToken and check with database
  const userInfo = refreshTokenVerify as refreshTokenInterface;
  const getRepo = getRepository(User);
  const OldRefreshTokens = await getRepo.findOne({
    select: ["refreshToken"],
    where: {
      id: userInfo.id,
    }
  })
  //if refreshTokens do return
  console.log(userInfo.id);
  if (!OldRefreshTokens) { return res.json({ success: false, message: "Error : Invalid refresh token!" }) }
  if (OldRefreshTokens.refreshToken.includes(refreshToken)) {

    //delete old refreshToken
    let updateTokens = OldRefreshTokens.refreshToken.filter((val) => val != refreshToken)
    await getRepo.update(
      { refreshToken: updateTokens },
      { id: userInfo.id }
    )
    //add new refreshToken
    const newRefreshToken = jwt.sign(userInfo.id, process.env.REFRESH_TOKEN_SECRET!);
    updateTokens.push(newRefreshToken);
    await getRepo.update(
      { refreshToken: updateTokens },
      { id: userInfo.id }
    )
    //return new refreshToken
    return res.json({
      success: true,
      message: "Valid refresh token.",
      newRefreshToken: newRefreshToken
    });
  } else {
    return res.json({ success: false, message: "Error : Token Invalid!" })
  }
})

export { router as authRouter }