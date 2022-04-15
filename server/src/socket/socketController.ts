import { Server, Socket } from "socket.io";
import { getRepository } from "typeorm";
import { Profile } from "../entity/Profile";
import { jwtDecode } from "../utils/jwtController";
import { friendListController } from "./friendList";
import { roomController } from "./room";

export const socketController = async (io: Server, socket: Socket) => {
  const accessToken: string = socket.handshake.auth.token;
  const decodedToken = jwtDecode<AccessToken>(accessToken);
  if (!decodedToken) {
    return socket.emit("error-msg", {
      message: "Token is not valid",
    });
  } else {
    const profileRepo = getRepository(Profile);
    const user = await profileRepo.findOne({
      where: { id: decodedToken.id },
    });

    if (!user) {
      return socket.emit("error-msg", {
        message: "User not found",
      });
    }
    console.log("connected user is: ", user.username, "...");
    // FUNCTIONS
    roomController(io, socket, user);
    friendListController(io, socket, user);
    return;
  }
};
