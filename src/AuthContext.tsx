import { useContext } from "react";
import { AuthContext } from "./Auth";

export function useUser() {
  const ctx = useContext(AuthContext);
  return ctx;
}