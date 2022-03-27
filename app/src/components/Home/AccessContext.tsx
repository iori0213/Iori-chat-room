import React from "react";

export const AccessContext = React.createContext<{ accessToken: string }>({
  accessToken: "",
});
