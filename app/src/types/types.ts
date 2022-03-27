interface Profile {
  id: string;
  username: string;
  showName: string;
}

interface Room {
  id: string;
  roomname: string;
}

interface Msg {
  id: number;
  senderId: string;
  msg: string;
  createdAt: string;
}
