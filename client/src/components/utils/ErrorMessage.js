import React from "react";
import { Alert } from "@mui/material";

const ErrorMessage = ({ variant = "error", children }) => {
  return <Alert severity={variant}>{children}</Alert>;
};

export default ErrorMessage;
