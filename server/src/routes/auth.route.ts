require('dotenv').config();
import express from "express";
import { getRepository } from "typeorm";
import User from "../entity/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { refreshTokenInterface } from "../constants/authUserInterface";
import { accessToken_Exp, refreshToken_Exp, accessTokenSecret, refreshTokenSecret } from "../constants/tokenConstant";

const router = express.Router()


// ANCHOR Register function
router.post("/register", async (req, res) => {
  try {
    const { email, username, password } = req.body;
    //ANCHOR Register - Find is the email existed
    const getRepo = getRepository(User);
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
    //ANCHOR Login - Find is the enail existed
    const getRepo = getRepository(User);
    const userCheck = await getRepo.findOne({
      select: ["id", "password", "refreshToken"],
      where: {
        email: email
      }
    })
    // ANCHOR Login - 1 filter: Email validation
    if (!userCheck) { return (res.status(400).json({ success: false, message: "User not found!" })) }
    // ANCHOR Login - 2 filter : Password validation
    const validPassword = await bcrypt.compare(password, userCheck.password)
    if (!validPassword) { return (res.status(400).json({ success: false, message: "Wrong password!" })) }
    //ANCHOR Login - Success sending JWT
    // Create a plaintext payload for the JWT
    const userInform = { id: userCheck.id }
    const accessToken = jwt.sign(userInform, accessTokenSecret!, { expiresIn: accessToken_Exp });
    const refreshToken = jwt.sign(userInform, refreshTokenSecret!, { expiresIn: refreshToken_Exp });
    let newRefreshToken: string[];
    //process refreshToken saving
    if (!userCheck.refreshToken) {
      newRefreshToken = [refreshToken]
    } else {
      newRefreshToken = userCheck.refreshToken
      newRefreshToken.push(...[refreshToken])
    }
    const updateRefreshToken = new User();
    updateRefreshToken.id = userCheck.id;
    updateRefreshToken.refreshToken = newRefreshToken;
    getRepo.save(updateRefreshToken);
    return (res.status(200).json({
      success: true,
      message: "Valid email & password.",
      accessToken: accessToken,
      refreshToken: refreshToken
    }))
  } catch (e) {
    console.log(e)
    res.status(500).send("Login: Something is broken!")
  }
  return ("WTF?")
})

router.post("/token/access", async (req, res) => {
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
    jwt.verify(accessToken, accessTokenSecret!, (err) => {
      if (err) {
        return res.status(401).json({ success: false, message: err })
      }
      return res.status(200).json({ success: true, message: "AccessToken is valid." })
    });
  } catch (e) {
    console.log(e);
    return (res.status(500).json({ success: false, message: "Error : Something is broken!" }));
  }
  return ("WTF?")
})

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

    //verify refreshToken
    jwt.verify(refreshToken, refreshTokenSecret!, async (err) => {
      if (err) {
        return (res.status(401).json({ success: false, message: err }));
      }
      const refreshTokenPayloads = jwt.decode(refreshToken) as refreshTokenInterface;
      const getRepo = getRepository(User);
      const refreshTokenCheck = await getRepo.findOne({
        select: ["refreshToken"],
        where: { id: refreshTokenPayloads.id }
      })
      //check if user exist
      if (!refreshTokenCheck) { return (res.status(401).json({ success: false, message: "Error : User not exist!" })) }
      //check if the refresh token is in the database refresh token string array
      const refreshTokenList = refreshTokenCheck.refreshToken as string[];
      if (!refreshTokenList.includes(refreshToken)) { return (res.status(401).json({ success: false.valueOf, message: "Error : Token is not in the list!" })) }
      //the refresh token is valid so create and return a new access token
      const userInfo = { id: refreshTokenPayloads.id }
      const newAccessToken = jwt.sign(userInfo, accessTokenSecret!, { expiresIn: accessToken_Exp });
      return (res.status(200).json({ success: true, message: "Valid refresh token.", newAccessToken: newAccessToken }))
    });
  } catch (e) {
    console.log(e);
    return (res.status(500).json({ success: false, message: "Error : Something is broken!" }));
  }
  return ("WTF?")
})

router.post("/token/logout", async (req, res) => {
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
    //get the refreshToken list from database by tokenPoayloads id
    const getRepo = getRepository(User);
    const refreshTokenPayloads = jwt.decode(refreshToken) as refreshTokenInterface;
    const checkRefreshToken = await getRepo.findOne({
      select: ["refreshToken"],
      where: { id: refreshTokenPayloads.id }
    })
    //if no user
    if (!checkRefreshToken) { return (res.status(400).json({ success: false, message: "Error : User not exist!" })) }
    //check is the token in the list or not
    let refreshTokenList = checkRefreshToken.refreshToken as string[];
    //not in the list
    if (!refreshTokenList.includes(refreshToken)) { return (res.status(400).json({ success: false, message: "Error : Token is not in the list!" })) }
    //in the list
    refreshTokenList = refreshTokenList.filter((token) => token != refreshToken);
    //create a update user form
    const updateRefreshToken = new User();
    updateRefreshToken.id = refreshTokenPayloads.id;
    updateRefreshToken.refreshToken = refreshTokenList;
    await getRepo.save(updateRefreshToken)
    return (res.status(200).json({ success: true, message: "Refresh token removed." }))
  } catch (e) {
    console.log(e);
    return (res.status(500).json({ success: false, message: "Error : Something is broken!" }));
  }
  return ("WTF!?")
})

export { router as authRouter }