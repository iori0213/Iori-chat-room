import React from "react";

interface Context {
  logged: boolean;
}

const GlobalContext = React.createContext<Context>({ logged: false });

export default GlobalContext;
