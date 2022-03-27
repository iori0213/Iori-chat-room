export type RootNavigationProps = {
  AuthNavigation: undefined;
  ChatNavigation: undefined;
}

export type AuthNavigationProps = {
  //navigation
  ChatNavigation: undefined;
  //screens
  LoginScreen: undefined;
  RegisterScreen: undefined;
}

export type HomeNavigationProps = {
  //screens
  HomeScreen: undefined;
  RoomListScreen: undefined;
  ChatScreen: {
    roomId: string;
    roomName: string;
  }
}

export type ChatNavigationProps = {
  HomeNavigation: undefined;
  ChatScreen: {
    roomId: string;
    roomName: string;
  }
}
