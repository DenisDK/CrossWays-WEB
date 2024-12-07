"use client";
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Avatar,
  Box,
  Snackbar,
  Alert,
} from "@mui/material";
import { LocalizationProvider, DesktopDatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useTranslations } from "next-intl";
import createTrip from "@/lib/createTrips";

const PopupForm = ({ open, handleClose }) => {
  const t = useTranslations("Trips");
  const [title, setTitle] = useState("");
  const [country, setCountry] = useState("");
  const [memberLimit, setMemberLimit] = useState("");
  const [dateFrom, setDateFrom] = useState(null);
  const [dateTo, setDateTo] = useState(null);
  const [about, setAbout] = useState("");
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [alert, setAlert] = useState({ severity: "", message: "" });
  const [errors, setErrors] = useState({});

  const handlePhotoChange = (event) => {
    const file = event.target.files[0];
    setPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    const newErrors = {};
    if (!title) newErrors.title = true;
    if (!country) newErrors.country = true;
    if (!memberLimit) newErrors.memberLimit = true;
    if (!dateFrom) newErrors.dateFrom = true;
    if (!dateTo) newErrors.dateTo = true;
    if (!about) newErrors.about = true;
    if (!photo) newErrors.photo = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setAlert({
        severity: "error",
        message: t("tripFillAllFieldsMessage"),
      });
      return;
    }

    const tripData = new FormData();
    tripData.append("title", title);
    tripData.append("country", country);
    tripData.append("memberLimit", Number(memberLimit));
    tripData.append("dateFrom", dateFrom ? dateFrom.toISOString() : "");
    tripData.append("dateTo", dateTo ? dateTo.toISOString() : "");
    tripData.append("description", about);
    tripData.append("photo", photo);

    try {
      await createTrip(tripData);
      setAlert({
        severity: "success",
        message: t("tripCreationSuccesMessage"),
      });
      handleClose();
      resetForm();
    } catch (error) {
      setAlert({ severity: "error", message: t("tripCreationErrorMessage") });
    }
  };

  const resetForm = () => {
    setTitle("");
    setCountry("");
    setMemberLimit("");
    setDateFrom(null);
    setDateTo(null);
    setAbout("");
    setPhoto(null);
    setPhotoPreview(null);
    setErrors({});
  };

  useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open]);

  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>{t("tripCreationTitle")}</DialogTitle>
        <DialogContent>
          <Box display="flex" alignItems="stretch" mt={2}>
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              mr={4}
            >
              <Avatar
                alt="Trip logo"
                src={photoPreview}
                variant="square"
                sx={{ width: 300, height: 400 }}
              />
              <Button
                variant="contained"
                component="label"
                fullWidth
                style={{ marginTop: "10px" }}
                error={errors.photo ? "true" : "false"}
              >
                {t("tripPhoto")}
                <input type="file" hidden onChange={handlePhotoChange} />
              </Button>
            </Box>
            <Box
              flexGrow={1}
              display="flex"
              flexDirection="column"
              justifyContent="space-between"
            >
              <TextField
                label={t("tripTitleLabel")}
                fullWidth
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                error={errors.title ? true : false}
              />
              <TextField
                label={t("tripCountryLabel")}
                fullWidth
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                error={errors.country ? true : false}
              />
              <TextField
                label={t("tripLimitLabel")}
                fullWidth
                type="number"
                value={memberLimit}
                onChange={(e) => setMemberLimit(e.target.value)}
                error={errors.memberLimit ? true : false}
              />
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Box display="flex" justifyContent="space-between">
                  <DesktopDatePicker
                    label={t("tripDateFrom")}
                    value={dateFrom}
                    onChange={(newValue) => setDateFrom(newValue)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        error={errors.dateFrom ? true : false}
                      />
                    )}
                  />
                  <DesktopDatePicker
                    label={t("tripDateTo")}
                    value={dateTo}
                    onChange={(newValue) => setDateTo(newValue)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        error={errors.dateTo ? true : false}
                      />
                    )}
                  />
                </Box>
              </LocalizationProvider>
              <TextField
                label={t("tripAbout")}
                fullWidth
                multiline
                rows={4}
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                error={errors.about ? true : false}
              />
              <Button
                onClick={handleSave}
                color="primary"
                variant="contained"
                fullWidth
                style={{ marginTop: "10px" }}
              >
                {t("tripCreateButton")}
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
      <Snackbar
        open={!!alert.message}
        autoHideDuration={2000}
        onClose={() => setAlert({ severity: "", message: "" })}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert
          onClose={() => setAlert({ severity: "", message: "" })}
          severity={alert.severity}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default PopupForm;
