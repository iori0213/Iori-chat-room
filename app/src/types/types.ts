type BasicProfile = {
  id: string;
  username: string;
  showName: string;
}

type RoomList = {
  id: string;
  roomname: string;
}

type Msg = {
  id: number,
  senderId: string,
  msg: string,
  createdAt: string,
}