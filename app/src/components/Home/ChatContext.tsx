import React from 'react';
import { Socket } from "socket.io-client";

interface Context {
  socket?: Socket;
}

export const ChatContext = React.createContext<Context>({});