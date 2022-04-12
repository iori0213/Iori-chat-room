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

interface RoomMember {
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
  sender: Profile;
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
