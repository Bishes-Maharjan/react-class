import type { ReactNode } from "react";
import { createContext, useEffect, useState } from "react";

interface UserData {
  username: string;
  password: string;
  email: string;
}

interface AuthContextType {
  user: UserData | null;
  setUser: React.Dispatch<React.SetStateAction<UserData | null>>;
  login: (userData: UserData) => void;
  logout: () => void;
  register: (userData: UserData) => { success: boolean; message: string };
}

const AuthContext = createContext<AuthContextType | null>(null);

const Auth = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    const loggedInUser = localStorage.getItem("currentUser");
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
    }
  }, []);

  const login = (userData: UserData) => {
    setUser(userData);
    localStorage.setItem("currentUser", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("currentUser");
  };

  const register = (userData: UserData) => {
    const users: UserData[] = JSON.parse(localStorage.getItem("users") || "[]");
    const userExists = users.find((u) => u.username === userData.username);
    if (userExists) {
      return { success: false, message: "Username already exists." };
    }
    users.push(userData);
    localStorage.setItem("users", JSON.stringify(users));
    return { success: true, message: "user registered success" };
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export { Auth, AuthContext };
