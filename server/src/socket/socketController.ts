import { Server, Socket } from "socket.io";
import { getRepository } from "typeorm";
import { FriendShip } from "../entity/FriendShip";
import { Profile } from "../entity/Profile";
import { jwtDecode } from "../utils/jwtController";
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
    const friendShipRepo = getRepository(FriendShip);
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

    socket.on("get-friend", async () => {
      const userProfile = await profileRepo.findOne({
        where: { id: user.id },
        relations: ["friendShips", "friendShips.user", "friendShips.friend"],
      });
      if (!userProfile) {
        return socket.emit("error-msg", { message: "User not found" });
      }

      const userFriendShip = userProfile.friendShips.map(
        (friendship) => friendship.friend
      );
      //getting other user's friend request
      const friendShipArray = await friendShipRepo.find({
        where: { friend: user },
      });
      const othersFriendShip = friendShipArray.map(
        (friendship) => friendship.user
      );
      //get friend List
      const friendList = userFriendShip.map((friendship) => {
        if (othersFriendShip.includes(friendship)) {
          return friendship;
        }
        return;
      });
      //get pending user friend request
      const myPendingList = userFriendShip.map((friendship) => {
        if (!othersFriendShip.includes(friendship)) {
          return friendship;
        }
        return;
      });
      //get other users friend request
      const otherPendingList = othersFriendShip.map((friendship) => {
        if (!userFriendShip.includes(friendship)) {
          return friendship;
        }
        return;
      });
      return socket.emit("get-friend-cli", {
        friendList: friendList,
        myPendingList: myPendingList,
        otherPendingList: otherPendingList,
      });
    });

    socket.on("add-friend", async (params: { friendName: string }) => {
      const { friendName } = params;
      const friendProfile = await profileRepo.findOne({
        where: { username: friendName },
      });
      //if friend profile not found
      if (!friendProfile) {
        return socket.emit("error-msg", {
          message: "Friend not found",
        });
      }
      const friendShipCheck = await friendShipRepo.findOne({
        where: { user: user, friend: friendProfile },
      });
      if (friendShipCheck) {
        return socket.emit("error-msg", {
          message: "You have already send the friend request.",
        });
      }
      //create friendship
      //user
      const userFriendShip = new FriendShip();
      userFriendShip.friend = friendProfile;
      userFriendShip.user = user;
      friendShipRepo.save(userFriendShip);

      //check reverse friend ship
      const friendUserShipCheck = await friendShipRepo.findOne({
        where: { user: friendProfile, friend: user },
      });
      if (friendUserShipCheck) {
        return io.emit("add-friend-cli", {
          success: true,
          message: "Friend request accepted",
          user: user,
          friend: friendProfile,
        });
      } else {
        return io.emit("add-friend-cli", {
          success: false,
          message: "Add friend success.",
          user: user,
          friend: friendProfile,
        });
      }
    });
    return;
  }
};
