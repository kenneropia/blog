import React, { useState, createContext } from "react";
import { login as userLogin, logOut as userLogout, getUser } from "./utils";

const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const UserContext = createContext(null);
  return <UserContext.Provider value={null}>{children}</UserContext.Provider>;
};

export default UserProvider;
