import React from "react";
import { User } from "../models/interfaces";

export const defaultUser: User = {
  id: "",
  full_name: "",
  sdk_id: "",
  active: false
}

export const UserContext = React.createContext({
  user: defaultUser,
  setUser: (user: User) => {}
});