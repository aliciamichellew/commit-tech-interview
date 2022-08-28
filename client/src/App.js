import { Routes, Route } from "react-router-dom";
import React, { createContext, useState, useEffect } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Landing from "./components/auth/LoginPage";

import Login from "./components/auth/LoginPage";
import SignUp from "./components/auth/SignUpPage";
import axios from "axios";
import ProfilePage from "./components/profile/ProfilePage";
import setAuthToken from "./components/utils/setAuthToken";

const theme = createTheme({});

export const UserContext = createContext();

axios.interceptors.request.use(function (config) {
  if (localStorage.getItem("userInfo")) {
    const token = JSON.parse(localStorage.getItem("userInfo")).token;
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default function App() {
  const init = localStorage.getItem("userInfo") || null;
  const [userInfo, setUserInfo] = useState(init ? JSON.parse(init) : null);

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    if (userInfo) {
      setAuthToken(userInfo.token);
    }
  }, [localStorage.getItem("userInfo")]);

  return (
    <ThemeProvider theme={theme}>
      <UserContext.Provider value={{ userInfo, setUserInfo }}>
        <Routes>
          <Route exact path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </UserContext.Provider>
    </ThemeProvider>
  );
}
