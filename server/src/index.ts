import "reflect-metadata";
import express from "express";
import cors from "cors";
import { createConnection } from "typeorm";
import { userRouter } from "./routes/user.route";
import { authRouter } from "./routes/auth.route";

const PORT = process.env.PORT || 5000;
const app = express();
app.use(cors());
app.use(express.json());

const main = () => {
  createConnection()
    .then(async () => {
      app.use("/api/v1/user", userRouter);
      app.use("/api/v1/auth", authRouter);
      app.listen(PORT, () => console.log(PORT))
    })
    .catch(error => console.log(error))
}

main();