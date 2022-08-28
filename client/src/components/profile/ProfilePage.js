import React, { useState, useEffect, useContext } from "react";

import { styled, useTheme } from "@mui/material/styles";
import {
  Box,
  Typography,
  Grid,
  Button,
  Card,
  CardContent,
  Tabs,
  Tab,
  IconButton,
} from "@mui/material";
import { Chat, Home, Logout, ViewModule, Work } from "@mui/icons-material";

import PropTypes from "prop-types";

import { useNavigate } from "react-router-dom";

import profile from "./profile.png";
import axios from "axios";
import EditProfileModal from "./EditProfileModal";
import ProfileAvatar from "./ProfileAvatar";
import { UserContext } from "../../App";

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ mx: 3, mb: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

export default function MyProfilePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { userInfo, setUserInfo } = useContext(UserContext);
  const userId = userInfo ? userInfo._id : null;
  const [userProfile, setUserProfile] = useState();
  const [profilePic, setProfilePic] = useState("");
  const [name, setName] = useState("");
  const [dateOfBirth, setDOB] = useState();

  const getUserProfile = async (e) => {
    try {
      setLoading(false);
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.get(
        `/api/users/getprofile/${userId}`,
        { userId },
        config
      );
      setUserProfile(data);
      setName(data.name);
      setDOB(data.dateOfBirth);
      setProfilePic(data.profilePic || "");
      setLoading(false);
    } catch (err) {}
  };

  useEffect(() => {
    getUserProfile();
  }, []);

  const handleEditProfile = async (event, _id, name, dateOfBirth, image) => {
    event.preventDefault();

    try {
      if (image) {
        const result = await axios.post("/api/users/uploadprofilepic", {
          image: image,
        });
        const uploadedImg = result.data.public_id;
        setProfilePic(uploadedImg);
        const { res } = await axios({
          method: "put",
          url: "/api/users/editprofile",
          data: {
            profile: {
              profilePic: uploadedImg,
            },
          },
        });
      }

      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { res } = await axios({
        method: "put",
        url: "/api/users/editprofile",
        data: {
          profile: {
            name: name,
            dateOfBirth: dateOfBirth,
          },
        },
      });

      await getUserProfile();
    } catch (error) {}
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Box component="main" sx={{ flexGrow: 1, pt: 0 }}>
        <Grid
          container
          component="main"
          sx={{
            minHeight: "100vh",
            display: "flex",
            alignContent: "flex-start",
          }}
        >
          <DrawerHeader />
          <Box
            sx={{
              mt: 5,
              mb: 4,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              width: "100%",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                mt: 5,
                mb: 4,
                mx: 4,
                display: "flex",
                flexDirection: "column",
                width: "100%",
                alignItems: "center",
              }}
            >
              <Box sx={{ display: "flex", flexDirection: "row" }}>
                {!profilePic && (
                  <img
                    src={profile}
                    alt="profile"
                    style={{
                      width: 150,
                      marginRight: 5,
                      borderRadius: "50%",
                    }}
                  />
                )}
                {profilePic && (
                  <ProfileAvatar profilePic={profilePic} width={150} />
                )}

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    ml: 5,
                  }}
                >
                  <Typography sx={{ fontSize: 40 }}>
                    {name.toUpperCase()}
                  </Typography>
                  <Typography sx={{ fontSize: 40 }}>{dateOfBirth}</Typography>
                </Box>
              </Box>
              <Box sx={{ display: "flex", flexDirection: "row" }}>
                <EditProfileModal handleEditProfile={handleEditProfile} />
                <Button
                  fullWidth
                  variant="contained"
                  sx={{
                    mt: 2,
                    mb: 0,
                    mx: 2,
                    width: 150,
                    height: 40,
                  }}
                  style={{ justifyContent: "center" }}
                  onClick={() => {
                    setUserInfo(null);
                    localStorage.removeItem("userInfo");
                    navigate("/");
                  }}
                  startIcon={<Logout />}
                >
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <Typography>Logout</Typography>
                  </Box>
                </Button>
              </Box>
            </Box>
          </Box>
        </Grid>
      </Box>
    </Box>
  );
}
