export type RootNavigationProps = {
  AuthNavigation: undefined;
  HomeStackNavigation: undefined;
};

export type AuthNavigationProps = {
  //navigation
  HomeStackNavigation: undefined;
  //screens
  LoginScreen: undefined;
  RegisterScreen: undefined;
};

export type HomeTabNavigationProps = {
  //screens
  FriendListScreen: undefined;
  RoomListScreen: undefined;
  ProfileScreen: undefined;
  ChatScreen: {
    roomId: string;
    roomName: string;
  };
  EditProfileScreen: {
    img: string;
    showname: string;
    username: string;
    email: string;
  };
};

export type HomeStackNavigationProps = {
  HomeNavigation: undefined;
  ChatScreen: {
    roomId: string;
    roomName: string;
  };
  RoomMembersScreen: {
    roomMembers: ProfileWithImg[];
    roomId: string;
  };
  EditProfileScreen: {
    img: string;
    showname: string;
    username: string;
    email: string;
  };
};
