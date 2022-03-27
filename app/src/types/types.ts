type BasicProfile = {
  id: string;
  username: string;
  showName: string;
}

type Room = {
  id: string;
  roomname: string;
}

type Msg = {
  id: number,
  senderId: string,
  msg: string,
  createdAt: string,
}