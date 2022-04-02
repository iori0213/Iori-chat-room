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
  ProfileScreen: undefined;
};

export type ChatNavigationProps = {
  HomeNavigation: undefined;
  ChatScreen: {
    roomId: string;
    roomName: string;
  };
};
