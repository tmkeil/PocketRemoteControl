import { router } from "expo-router";
import React, { createContext, useContext, useState } from "react";

type AuthContextType = {
  isLoggedIn: boolean;
  logIn: (token: string, apiUrl: string) => void;
  logOut: () => void;
  validateLogin: (token: string, apiUrl: string) => Promise<boolean>;
  token?: string;
  apiUrl?: string;
};

export const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  logIn: () => {},
  logOut: () => {},
  validateLogin: async () => false,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState<string | undefined>();
  const [apiUrl, setApiUrl] = useState<string | undefined>();

const validateLogin = async (newToken: string, newUrl: string): Promise<boolean> => {
  try {
    const response = await fetch(`http://192.168.2.30:3000/check-status?newURL=${encodeURIComponent(newUrl)}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${newToken}`,
      },
    });
    // const response = await fetch(`${apiUrl}/check-status?newURL=${encodeURIComponent(newUrl)}`, {
    //   method: "GET",
    //   headers: {
    //     Authorization: `Bearer ${newToken}`,
    //   },
    // });
    if (!response.ok) {
      throw new Error("Invalid token or API not reachable.");
    }
    const data = await response.json();
    console.log("Daten: ", data);

    return true;
  } catch (error) {
    console.error("Error at API request:", error);
    return false;
  }
};

  const logIn = (newToken: string, newUrl: string) => {
    setToken(newToken);
    setApiUrl(newUrl);
    validateLogin(newToken, newUrl);
    setIsLoggedIn(true);
    router.replace("/(protected)/home");
  };

  const logOut = () => {
    setToken(undefined);
    setApiUrl(undefined);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, logIn, logOut, validateLogin, token, apiUrl }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
