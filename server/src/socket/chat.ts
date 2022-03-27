import { Server, Socket } from "socket.io";
import ChatRoom from "../entity/ChatRoom";
import { Profile } from "../entity/Profile";

export const chatController = (
  _io: Server,
  socket: Socket,
  profile: Profile,
  room: ChatRoom,
) => {
  socket.on("send-msg", (params: { msg: string }) => {

  });
};
