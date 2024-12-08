import { useState } from "react";

const useSnackbar = () => {
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("error");

  const handleSnackbarClose = () => {
    setSnackBarOpen(false);
  };

  const showAlert = (message, severity = "error") => {
    setAlertMessage(message);
    setAlertSeverity(severity);
    setSnackBarOpen(true);
  };

  return {
    snackBarOpen,
    alertMessage,
    alertSeverity,
    handleSnackbarClose,
    showAlert,
  };
};

export default useSnackbar;
