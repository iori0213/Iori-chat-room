export type RootNavigationProps = {
  AuthNavigation: undefined;
  ChatNavigation: undefined;
};

export type AuthNavigationProps = {
  //navigation
  ChatNavigation: undefined;
  //screens
  LoginScreen: undefined;
  RegisterScreen: undefined;
};

export type HomeNavigationProps = {
  //screens
  FriendListScreen: undefined;
  RoomListScreen: undefined;
  ChatScreen: {
    roomId: string;
    roomName: string;
  };
  ProfileNavigation: undefined;
};

export type ChatNavigationProps = {
  HomeNavigation: undefined;
  ChatScreen: {
    roomId: string;
    roomName: string;
  };
};

export type ProfileNavigationProps = {
  ProfileScreen: undefined;
  EditProfileScreen: {
    img: string;
    showname: string;
    username: string;
    email: string;
  };
};
