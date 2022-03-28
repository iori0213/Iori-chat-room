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
  id: string;
  sender: Profile;
  msg: string;
  createdAt: string;
}
