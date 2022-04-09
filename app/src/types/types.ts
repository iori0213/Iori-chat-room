interface userInfo {
  email: string;
  username: string;
  showname: string;
}
interface Profile {
  id: string;
  username: string;
  showName: string;
}

interface RoomProfile {
  id: string;
  username: string;
  showname: string;
  profileImg: string;
}

interface Room {
  id: string;
  roomname: string;
}

interface Msg {
  id: string;
  sender: RoomProfile;
  msg: string;
  createdAt: string;
}

interface MemberCheck {
  id: string;
  username: string;
  showName: string;
  join: boolean;
}

interface UpdateMsg {
  id: string;
  msg: string;
}
