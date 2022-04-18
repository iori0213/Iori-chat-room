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

  //ANCHOR Get Friend
  const getFriend = async () => {
    const friendShips = await friendShipRepo.find({
      where: [{ user: user.id }, { friend: user.id }],
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
  };
  socket.on("get-friend", getFriend);

  //ANCHOR Add Friend
  const addFriend = async (params: { friendName: string }) => {
    const { friendName } = params;
    const userProfile = await profileRepo.findOne({
      where: { id: user.id },
      relations: ["avatar"],
    });
    if (!userProfile) {
      socket.emit("error-msg", "User not found");
      return;
    }
    const friendProfile = await profileRepo.findOne({
      where: { username: friendName },
      relations: ["avatar"],
    });
    //if friend profile not found
    if (!friendProfile) {
      socket.emit("error-msg", "Friend not found");
      return;
    }
    const friendShip = await friendShipRepo.findOne({
      where: [
        { user: user.id, friend: friendProfile.id },
        { user: friendProfile.id, friend: user.id },
      ],
      relations: ["user", "friend"],
    });
    if (friendShip) {
      if (friendShip.user.id == user.id && !friendShip.active) {
        socket.emit("error-msg", "Your request is still pending.");
        return;
      } else if (friendShip.friend.id == user.id && !friendShip.active) {
        friendShip.active = true;
        await friendShipRepo.save(friendShip);
        const returnUser = profileToProfileWithImg(userProfile);
        const returnFriend = profileToProfileWithImg(friendProfile);
        io.emit("add-friend-cli", {
          user: returnUser,
          friend: returnFriend,
          activate: friendShip.active,
        });
        return;
      } else if (friendShip.active) {
        socket.emit("error-msg", "Already is friend!");
        return;
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
      io.emit("add-friend-cli", {
        user: returnUser,
        friend: returnFriend,
      });
      return;
    }
    return;
  };
  socket.on("add-friend", addFriend);

  //ANCHOR Remove Friend
  const removeFriend = async (params: { friendId: string }) => {
    const { friendId } = params;
    const friendProfile = await profileRepo.findOne({
      where: { id: friendId },
    });
    if (!friendProfile) {
      socket.emit("error-msg", "Friend not found!");
      return;
    }
    //getting both friendship
    const friendShip = await friendShipRepo.findOne({
      where: [
        { user: user.id, friend: friendProfile.id },
        { user: friendProfile.id, friend: user.id },
      ],
    });
    if (!friendShip) {
      socket.emit("error-msg", "Friendship not found");
      return;
    }
    //remove friendship
    await friendShipRepo.remove(friendShip);
    io.emit("remove-friend-cli", {
      user: user.username,
      friend: friendProfile.username,
    });
    return;
  };
  socket.on("remove-friend", removeFriend);

  return () => {
    socket.off("get-friend", getFriend);
    socket.off("add-friend", addFriend);
    socket.off("remove-friend", removeFriend);
  };
};
