require('dotenv').config();
import express from "express";
import { getRepository } from "typeorm";
import User from "../entity/User";
import bcrypt from "bcrypt";
import Jwt from "jsonwebtoken";
import { accessToken_Exp, refreshToken_Exp, accessTokenSecret, refreshTokenSecret } from "../constants/tokenConstant";
import { Profile } from "../entity/Profile";
import { jwtDecode, jwtVerify } from "../utils/jwtController";

const router = express.Router()


// ANCHOR Register function
router.post("/register", async (req, res) => {
  try {
    const { email, name, password } = req.body;
    console.log({ email: email, name: name, password: password })
    //ANCHOR Register - Find is the email existed
    const userRepo = getRepository(User);
    const profileRepo = getRepository(Profile);
    const checkEmail = await userRepo.findOne({
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
      const checkUsername = await profileRepo.findOne({
        where: {
          username: name
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
        newUser.password = hashedPassword;
        const newProfile = new Profile();
        newProfile.username = name;
        await profileRepo.save(newProfile);
        newUser.profile = newProfile;
        await userRepo.save(newUser);
        return res
          .status(200)
          .json({
            success: true,
            message: "Register success!"
          })
      }
    }
  } catch (e) {
    console.log("Register Error :", e);
    return res
      .status(500)
      .send("Register : Something is broken!")
  }
})

// ANCHOR Login function
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    //ANCHOR Login - Find is the enail existed
    const userRepo = getRepository(User);
    const userCheck = await userRepo.findOne({
      select: ["id", "password", "refreshToken"],
      where: {
        email: email
      },
      relations: ["profile"]
    })
    // ANCHOR Login - 1 filter: Email validation
    if (!userCheck) { return (res.status(400).json({ success: false, message: "User not found!" })) }
    // ANCHOR Login - 2 filter : Password validation
    const validPassword = await bcrypt.compare(password, userCheck.password)
    if (!validPassword) { return (res.status(400).json({ success: false, message: "Wrong password!" })) }
    //ANCHOR Login - Success sending JWT
    // Create a plaintext payload for the JWT
    const userInform = { id: userCheck.profile.id }
    const accessToken = Jwt.sign(userInform, accessTokenSecret!, { expiresIn: accessToken_Exp });
    const refreshToken = Jwt.sign(userInform, refreshTokenSecret!, { expiresIn: refreshToken_Exp });
    let newRefreshToken: string[];
    //process refreshToken saving
    if (!userCheck.refreshToken) {
      newRefreshToken = [refreshToken]
    } else {
      newRefreshToken = userCheck.refreshToken
      newRefreshToken.push(refreshToken)
    }
    userCheck.refreshToken = newRefreshToken;
    userRepo.save(userCheck);
    // getRepo.save(updateRefreshToken);
    return (res.status(200).json({
      success: true,
      message: "Valid email & password.",
      accessToken: accessToken,
      refreshToken: refreshToken
    }))
  } catch (e) {
    console.log("Login Error : ", e)
    res.status(500).send("Login: Something is broken!")
  }
  return ("WTF?")
})

// ANCHOR Access token validation
router.post("/token/access", async (req, res) => {
    console.log('validating accessToken')
  try {
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
    //check is the authMethod & accessToken exist and the is method correct
    if (!authMethod || !accessToken) { return (res.status(400).json({ success: false, message: "Error : Invalid auth header!" })) }
    else if (authMethod !== "Bearer") { return (res.status(400).json({ success: false, message: "Error : Invalid auth method!" })) }
    //verify accessToken
    Jwt.verify(accessToken, accessTokenSecret!, (err) => {
      if (err) {
        return res.status(401).json({ success: false, message: err })
      }
      return res.status(200).json({ success: true, message: "AccessToken is valid." })
    });
  } catch (e) {
    console.log("accessToken validation error :", e);
    return (res.status(500).json({ success: false, message: "Error : Something is broken!" }));
  }
  return ("WTF?")
})
// ANCHOR Refresh token validation
router.post("/token/refresh", async (req, res) => {
  try {
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
    if (!authMethod || !refreshToken) { return (res.status(400).json({ success: false, message: "Error : Invalid auth header!" })) }
    else if (authMethod !== "Bearer") { return (res.status(400).json({ success: false, message: "Error : Invalid auth method!" })) }

    //start verify refresh token
    const refreshTokenPayloads = jwtVerify<RefreshToken>(refreshToken, refreshTokenSecret!);
    if (!refreshTokenPayloads) return res.status(401).json({ success: false, message: "Error : Invalid refresh token!" })
    //check if user exist
    const userRepo = getRepository(User);
    const refreshTokenCheck = await userRepo.findOne({
      select: ["refreshToken"],
      where: { profile: { id: refreshTokenPayloads.id } }
    })
    if (!refreshTokenCheck) return res.status(404).json({ success: false, message: "Error : User not found!" })
    //check if the refresh token is in the database refresh token string array
    const refreshTokenList = refreshTokenCheck.refreshToken as string[];
    if (!refreshTokenList.includes(refreshToken)) { return (res.status(401).json({ success: false.valueOf, message: "Error : Token is not in the list!" })) }
    //the refresh token is valid so create and return a new access token
    const userInfo = { id: refreshTokenPayloads.id }
    const newAccessToken = Jwt.sign(userInfo, accessTokenSecret!, { expiresIn: accessToken_Exp });
    return (res.status(200).json({ success: true, message: "Valid refresh token.", newAccessToken: newAccessToken }))
  } catch (e) {
    console.error("refreshToken validation error:", e);
    return (res.status(500).json({ success: false, message: "Error : Something is broken!" }));
  }
})
// ANCHOR Revoke refresh token after loagout
router.post("/token/logout", async (req, res) => {
  //check if the req.headers["authorization"] exist
  const userRepo = getRepository(User);
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
  if (!authMethod || !refreshToken) { console.log("stage1"); return (res.status(400).json({ success: false, message: "Error : Invalid auth header!" })) }
  else if (authMethod !== "Bearer") { console.log("stage2"); return (res.status(400).json({ success: false, message: "Error : Invalid auth method!" })) }
  //get the refreshToken list from database by tokenPoayloads id
  const refreshTokenPayloads = jwtDecode<RefreshToken>(refreshToken)
  if (!refreshTokenPayloads) {
    return res.json({
      success: false,
      error: {
        message: 'Error: Refresh Token invalid',
      }
    })
  }
  const user = await userRepo.findOne({
    where: {
      profile: {
        id: refreshTokenPayloads.id
      }
    },
  })
  //if no user
  if (!user) { return (res.status(400).json({ success: false, message: "Error : User not exist!" })) }
  //check is the token in the list or not
  console.log("looking for list")
  let refreshTokenList = user.refreshToken as string[];
  //not in the list
  if (!refreshTokenList.includes(refreshToken)) { return (res.status(400).json({ success: false, message: "Error : Token is not in the list!" })) }
  //in the list
  refreshTokenList = refreshTokenList.filter((token) => token != refreshToken);
  //create a update user form
  user.refreshToken = refreshTokenList;
  await userRepo.save(user);

  return (res.status(200).json({ success: true, message: "Refresh token removed." }))
})

export { router as authRouter }
