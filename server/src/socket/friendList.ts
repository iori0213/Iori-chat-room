import { Server, Socket } from "socket.io";
import { getRepository } from "typeorm";
import Avatar from "../entity/Avatar";
import { FriendShip } from "../entity/FriendShip";
import { Profile } from "../entity/Profile";
import { ProfileWithImg } from "../types/types";

export const friendListController = (
  io: Server,
  socket: Socket,
  user: Profile
) => {
  const Bto64 = (avatar: Avatar | undefined) => {
    return avatar ? avatar.profileImg.toString("base64") : "";
  };
  const profileToProfileWithImg = (inputProfile: Profile) => {
    const newProfile: ProfileWithImg = {
      id: inputProfile.id,
      username: inputProfile.username,
      showname: inputProfile.showname,
      profileImg: Bto64(inputProfile.avatar),
    };
    return newProfile;
  };
  const profileRepo = getRepository(Profile);
  const friendShipRepo = getRepository(FriendShip);
  socket.on("get-friend", async () => {
    const friendShips = await friendShipRepo.find({
      where: [{ user: user }, { friend: user }],
      relations: ["user", "user.avatar", "friend", "friend.avatar"],
    });
    const friendList: ProfileWithImg[] = [];
    const userRequestList: ProfileWithImg[] = [];
    const friendRequestList: ProfileWithImg[] = [];
    friendShips.forEach((friendship) => {
      //organize friend list
      if (friendship.active === true) {
        if (friendship.user.id == user.id) {
          friendList.push(profileToProfileWithImg(friendship.friend));
        } else if (friendship.friend.id == user.id) {
          friendList.push(profileToProfileWithImg(friendship.user));
        }
        //start organize request
      } else {
        if (friendship.user.id == user.id) {
          userRequestList.push(profileToProfileWithImg(friendship.friend));
        }
        if (friendship.friend.id == user.id) {
          friendRequestList.push(profileToProfileWithImg(friendship.user));
        }
      }
    });
    socket.emit("get-friend-cli", {
      friendList: friendList,
      userRequestList: userRequestList,
      friendRequestList: friendRequestList,
    });
  });

  //ANCHOR ADD FRIEND
  socket.on("add-friend", async (params: { friendName: string }) => {
    const { friendName } = params;
    const userProfile = await profileRepo.findOne({
      where: { id: user.id },
      relations: ["avatar"],
    });
    if (!userProfile) {
      return socket.emit("error-msg", { message: "User not found" });
    }
    const friendProfile = await profileRepo.findOne({
      where: { username: friendName },
      relations: ["avatar"],
    });
    //if friend profile not found
    if (!friendProfile) {
      return socket.emit("error-msg", {
        message: "Friend not found",
      });
    }
    const friendShip = await friendShipRepo.findOne({
      where: [
        { user: user, friend: friendProfile },
        { user: friendProfile, friend: user },
      ],
    });
    if (friendShip) {
      if (friendShip.user == user && !friendShip.active) {
        return socket.emit("error-msg", {
          message: "Your request is still pending.",
        });
      } else if (friendShip.friend == user && !friendShip.active) {
        friendShip.active = true;
        await friendShipRepo.save(friendShip);
        const returnUser = profileToProfileWithImg(userProfile);
        const returnFriend = profileToProfileWithImg(friendProfile);
        return io.emit("add-friend-cli", {
          user: returnUser,
          friend: returnFriend,
          activate: friendShip.active,
        });
      }
    } else {
      const newFriendShip = new FriendShip();
      newFriendShip.user = userProfile;
      newFriendShip.friend = friendProfile;
      newFriendShip.active = false;
      await friendShipRepo.save(newFriendShip);
      //transform info data
      const returnUser = profileToProfileWithImg(userProfile);
      const returnFriend = profileToProfileWithImg(friendProfile);
      //return result
      return io.emit("add-friend-cli", {
        user: returnUser,
        friend: returnFriend,
        activate: newFriendShip.active,
      });
    }
    return;
  });

  socket.on("remove-friend", async (params: { friendId: string }) => {
    const { friendId } = params;
    const friendProfile = await profileRepo.findOne({
      where: { id: friendId },
    });
    if (!friendProfile) {
      return socket.emit("error-msg", { message: "Friend not found!" });
    }

    //getting both friendship
    const userFriendShip = await friendShipRepo.findOne({
      where: {
        user: user,
        friend: friendProfile,
      },
    });
    const friendFriendShip = await friendShipRepo.findOne({
      where: {
        user: friendProfile,
        friend: user,
      },
    });
    if (!userFriendShip || !friendFriendShip) {
      return socket.emit("error-msg", { message: "Friendship not found" });
    }
    //remove friendship
    await friendShipRepo.remove(userFriendShip);
    await friendShipRepo.remove(friendFriendShip);
    return io.emit("remove-friend-cli", {
      user: user.id,
      friend: friendProfile.id,
    });
  });
};
