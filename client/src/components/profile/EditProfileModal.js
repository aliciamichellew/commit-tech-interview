import React, { useContext, useEffect, useState } from "react";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Box,
  Avatar,
  Input,
} from "@mui/material";
import { Edit } from "@mui/icons-material";
import axios from "axios";
import ProfileAvatar from "./ProfileAvatar";
import { UserContext } from "../../App";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";

const EditProfileModal = ({ handleEditProfile }) => {
  const [open, setOpen] = useState(false);
  const { userInfo } = useContext(UserContext);
  const userId = userInfo ? userInfo._id : null;
  const [profile, setProfile] = useState();
  const [name, setName] = useState("");
  const [dateOfBirth, setDOB] = useState();
  const [profilePic, setProfilePic] = useState("");
  const [image, setImage] = useState("");

  const getUserProfile = async (e) => {
    try {
      // setLoading(false);
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
      setProfile(data);
      setName(data.name || "");
      setDOB(data.dateOfBirth || "");
      setProfilePic(data.profilePic || "");
    } catch (err) {}
  };

  const handleChangeDOB = (newValue) => {
    setDOB(newValue);
  };

  useEffect(() => {
    getUserProfile();
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  function previewFiles(file) {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = () => {
      setImage(reader.result);
    };
  }

  const handleChange = (e) => {
    const file = e.target.files[0];
    setProfilePic(file);
    previewFiles(file);
  };

  if (!userId || !userInfo) {
    return <></>;
  }

  return (
    <div>
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
        onClick={handleClickOpen}
        startIcon={<Edit />}
      >
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Typography>Edit</Typography>
        </Box>
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", width: "500px" }}
        >
          <Box>
            {image && (
              <Avatar
                alt="Remy Sharp"
                src={image}
                sx={{ mr: 2, width: 150, height: 150 }}
              />
            )}
            {!image && <ProfileAvatar profilePic={profilePic} width={150} />}
          </Box>

          <label htmlFor="icon-button-file">
            <Input
              accept="image/*"
              id="icon-button-file"
              type="file"
              onChange={(e) => handleChange(e)}
            />
          </label>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Typography sx={{ fontSize: 20 }}>Name</Typography>
            <TextField
              id="outlined-textarea"
              maxRows={5}
              sx={{ my: 1 }}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Box>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DesktopDatePicker
              label="Date of Birth"
              required
              inputFormat="MM/dd/yyyy"
              value={dateOfBirth}
              onChange={handleChangeDOB}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
        </DialogContent>
        <DialogActions>
          <Box
            component="form"
            noValidate
            onSubmit={(event) => {
              handleEditProfile(event, userId, name, dateOfBirth, image);
              handleClose();
            }}
          >
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit">Submit</Button>
          </Box>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default EditProfileModal;
