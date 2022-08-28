// import "./styles.css";
import { Routes, Route } from "react-router-dom";
import React, { createContext, useState, useEffect } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Landing from "./components/auth/LoginPage";

// import Home from "./components/home/Home";
import Login from "./components/auth/LoginPage";
import SignUp from "./components/auth/SignUpPage";
// import Profile from "./components/Profile";
import axios from "axios";
// import AllModules from "./components/modules/AllModules";
// import ProfilePage from "./components/profile/ProfilePage";
// import ModulePage from "./components/modules/ModulePage";
import setAuthToken from "./components/utils/setAuthToken";
// import CommentPage from "./posts/CommentPage";
// import MyModules from "./components/modules/MyModules";
// import MyProfilePage from "./components/profile/MyProfilePage";
// import AllInternship from "./components/internship/AllInternship";
// import MyInternship from "./components/internship/MyInternships";
// import InternshipPage from "./components/internship/InternshipPage";
// import ChatPage from "./components/chat/ChatPage";
// import VerifyMail from "./components/auth/VerifyMail";
// import Verify from "./components/auth/Verify";
// import ForgotPassword from "./components/auth/ForgotPassword";
// import ResetPassword from "./components/auth/ResetPassword";

const theme = createTheme({
  typography: {
    fontFamily: ["Berlin Sans FB"].join(","),
  },
});

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
          {/* <Route path="/home" element={<Home />} /> */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          {/* <Route path="/myprofile" element={<MyProfilePage />} />
          <Route path="/allmodules" element={<AllModules />} />
          <Route path="/mymodules" element={<MyModules />} />
          <Route path="/profile/:username" element={<ProfilePage />} />
          <Route path="/modules/:moduleCode" element={<ModulePage />} />
          <Route path="/commentpage/:postId" element={<CommentPage />} />
          <Route path="/allinternship" element={<AllInternship />} />
          <Route path="/myinternship" element={<MyInternship />} /> */}
          {/* <Route
            path="/internships/:internshipId"
            element={<InternshipPage />}
          />
          <Route path="/chats" element={<ChatPage />} />
          <Route path="/verifymail" element={<VerifyMail />} />
          <Route path="/verify/:token" element={<Verify />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/resetpassword/:token" element={<ResetPassword />} /> */}
        </Routes>
      </UserContext.Provider>
    </ThemeProvider>
  );
}
