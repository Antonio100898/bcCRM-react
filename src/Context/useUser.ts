import { UserContext } from "./UserContext";
import { useContext } from "react";

export const useUser = () => useContext(UserContext);
