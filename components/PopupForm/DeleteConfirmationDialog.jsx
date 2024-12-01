import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
import { useTranslations } from "next-intl";

const DeleteConfirmationDialog = ({ open, handleClose, handleConfirm }) => {
  const t = useTranslations("Trips");
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{t("tripDeletionTitle")}</DialogTitle>
      <DialogContent>
        <Typography>{t("tripDeletionParagraph")}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          {t("tripDeletionCancelButton")}
        </Button>
        <Button onClick={handleConfirm} color="error">
          {t("tripDeletionDeleteButton")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmationDialog;
