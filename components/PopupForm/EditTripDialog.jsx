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
import dayjs from "dayjs";
import { doc, getDoc, updateDoc, Timestamp } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db } from "@/lib/firebase";
import { useTranslations } from "next-intl";

const EditTripDialog = ({ open, handleClose, tripId }) => {
  const t = useTranslations("Trips");
  const [title, setTitle] = useState("");
  const [country, setCountry] = useState("");
  const [memberLimit, setMemberLimit] = useState("");
  const [from, setFrom] = useState(null);
  const [to, setTo] = useState(null);
  const [about, setAbout] = useState("");
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [alert, setAlert] = useState({ severity: "", message: "" });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open && tripId) {
      const fetchTripDetails = async () => {
        try {
          const tripDocRef = doc(db, "Trips", tripId);
          const tripDoc = await getDoc(tripDocRef);
          if (tripDoc.exists()) {
            const tripData = tripDoc.data();
            setTitle(tripData.title || "");
            setCountry(tripData.country || "");
            setMemberLimit(tripData.memberLimit || "");
            setFrom(tripData.from ? dayjs(tripData.from.toDate()) : null);
            setTo(tripData.to ? dayjs(tripData.to.toDate()) : null);
            setAbout(tripData.description || "");
            setPhotoPreview(tripData.imageUrl || null);
          } else {
            console.error("Trip not found");
          }
        } catch (error) {
          console.error("Failed to fetch trip details:", error);
        }
      };

      fetchTripDetails();
    }
  }, [open, tripId]);

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
    if (!from) newErrors.from = true;
    if (!to) newErrors.to = true;
    if (!about) newErrors.about = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setAlert({
        severity: "error",
        message: t("tripFillAllFieldsMessage"),
      });
      return;
    }

    let imageUrl = photoPreview;

    if (photo) {
      const storage = getStorage();
      const storageRef = ref(storage, `trips/${tripId}/${photo.name}`);
      await uploadBytes(storageRef, photo);
      imageUrl = await getDownloadURL(storageRef);
    }

    const tripData = {
      title,
      country,
      memberLimit: Number(memberLimit),
      from: from ? Timestamp.fromDate(from.toDate()) : null,
      to: to ? Timestamp.fromDate(to.toDate()) : null,
      description: about,
      imageUrl,
    };

    try {
      const tripDocRef = doc(db, "Trips", tripId);
      await updateDoc(tripDocRef, tripData);
      setAlert({ severity: "success", message: t("tripEditSuccesMessage") });
      handleClose();
      resetForm();
    } catch (error) {
      setAlert({ severity: "error", message: t("tripEditErrorMessage") });
    }
  };

  const resetForm = () => {
    setTitle("");
    setCountry("");
    setMemberLimit("");
    setFrom(null);
    setTo(null);
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
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        BackdropProps={{ onClick: handleClose }}
      >
        <DialogTitle>{t("tripEditTitle")}</DialogTitle>
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
                    value={from}
                    onChange={(newValue) => setFrom(newValue)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        error={errors.from ? true : false}
                      />
                    )}
                  />
                  <DesktopDatePicker
                    label={t("tripDateTo")}
                    value={to}
                    onChange={(newValue) => setTo(newValue)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        fullWidth
                        error={errors.to ? true : false}
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
                {t("tripEditSaveButton")}
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

export default EditTripDialog;
