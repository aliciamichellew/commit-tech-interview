import React, { useEffect, useState, useContext } from "react";
import {
  Button,
  CssBaseline,
  TextField,
  Link,
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  CardActions,
  CircularProgress,
  Alert,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";

import ErrorMessage from "../utils/ErrorMessage";
import setAuthToken from "../utils/setAuthToken";

import { Link as RouterLink, useNavigate } from "react-router-dom";

import axios from "axios";
import { addUserToLocalStorage } from "../utils/localStorage";
import { UserContext } from "../../App";

const theme = createTheme();

export default function SignUpSide() {
  const [isSignUpFail, setIsSignUpFail] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUserInfo } = useContext(UserContext);
  const [dateOfBirth, setDOB] = React.useState(Date.now());

  const handleChange = (newValue) => {
    setDOB(newValue);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setMessage("Passwords Do not Match");
    } else {
      setMessage(null);
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
          },
        };

        setLoading(true);
        const { data } = await axios.post(
          "/api/users",
          { name, email, password },
          config
        );
        setUserInfo(data);
        localStorage.setItem("userInfo", JSON.stringify(data));
        setAuthToken(data.token);
        // navigate("/verifymail");
      } catch (error) {
        setIsSignUpFail(true);
      } finally {
        setLoading(false);
      }
    }
  };

  const [open, setOpen] = React.useState(false);

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex" }}>
        <Box component="main" sx={{ flexGrow: 1, p: 0 }}>
          <Grid container component="main" sx={{ height: "100vh" }}>
            <CssBaseline />
            <Grid
              item
              xs={12}
              sm={8}
              md={5}
              square
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Box
                sx={{
                  my: 8,
                  mx: 4,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Typography fontSize={50} sx={{ my: 5 }}>
                  Sign Up
                </Typography>
                <Card sx={{ mx: 5 }}>
                  <CardContent>
                    {error && <ErrorMessage> {error} </ErrorMessage>}
                    {message && <ErrorMessage> {message} </ErrorMessage>}
                    {loading && <CircularProgress />}
                    <Box
                      component="form"
                      noValidate
                      onSubmit={handleSubmit}
                      sx={{ mt: 0 }}
                    >
                      <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="name"
                        label="Name"
                        name="name"
                        autoComplete="name"
                        autoFocus
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />

                      <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DesktopDatePicker
                          label="Date of Birth"
                          required
                          inputFormat="MM/dd/yyyy"
                          value={dateOfBirth}
                          onChange={handleChange}
                          renderInput={(params) => <TextField {...params} />}
                        />
                      </LocalizationProvider>

                      <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="confirmPassword"
                        label="Confirm Password"
                        type="password"
                        id="confirmPassword"
                        autoComplete="current-password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </Box>
                  </CardContent>
                  {isSignUpFail && (
                    <div style={{ padding: "0px 10px 0px 10px" }}>
                      <Alert severity="error">User already existed!</Alert>
                    </div>
                  )}
                  <CardActions
                    sx={{
                      display: "flex",
                      alignContent: "center",
                      flexDirection: "column",
                      justifyContent: "center",
                    }}
                  >
                    <Box
                      component="form"
                      noValidate
                      onSubmit={handleSubmit}
                      sx={{ mt: 1 }}
                    >
                      <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{
                          mt: 2,
                          mb: 0,
                          color: "#000000",
                        }}
                      >
                        <Typography>Sign Up</Typography>
                      </Button>
                      <Grid container>
                        <Grid item>
                          <Link
                            component={RouterLink}
                            to="/login"
                            variant="body2"
                          >
                            <Typography>{"Have an account? Log in"}</Typography>
                          </Link>
                        </Grid>
                      </Grid>
                    </Box>
                  </CardActions>
                </Card>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
