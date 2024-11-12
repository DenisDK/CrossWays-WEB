"use client";
import { Timestamp } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import Header from "@/components/Header/Header";
import {
  Avatar,
  CircularProgress,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Rating,
  Switch,
  TextField,
  Tooltip,
  Typography,
  Snackbar,
} from "@mui/material";
import { LocalizationProvider, DesktopDatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { auth, db, storage } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore"; // Додано імпорт для запиту
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { FaCloudUploadAlt } from "react-icons/fa";
import Alert from "@mui/material/Alert";
import { useTranslations } from "next-intl";

const ProfilePage = () => {
  const t = useTranslations("Profile");
  const [user, setUser] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");
  const [aboutMe, setAboutMe] = useState("");
  const [gender, setGender] = useState("");
  // const [birthday, setBirthday] = useState(dayjs("")); // Ініціалізація порожньою датою
  const [birthday, setBirthday] = useState(null); // Ініціалізація порожньою датою
  const [isPrivate, setIsPrivate] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({
    nickname: false,
    gender: false,
    birthday: false,
  });
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Для сповіщень
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState("success");
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userDocRef = doc(db, "Users", currentUser.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const data = userDoc.data();
          setProfileData(data);
          setName(data.name);
          setNickname(data.nickname);
          setAboutMe(data.aboutMe);
          setGender(data.gender);
          // setBirthday(dayjs(data.birthday));
          // Встановлюємо дату народження правильно
          if (data.birthday) {
            setBirthday(dayjs(data.birthday.toDate())); // Перетворюємо Timestamp на dayjs
          }
          setIsPrivate(data.isPrivate);
        }
      } else {
        setUser(null);
        setProfileData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const uploadProfileImage = async () => {
    if (!profileImage) return;

    const storageRef = ref(storage, `profileImages/${user.uid}`);
    await uploadBytes(storageRef, profileImage);
    const downloadURL = await getDownloadURL(storageRef);

    const userDocRef = doc(db, "Users", user.uid);
    await setDoc(userDocRef, { profileImage: downloadURL }, { merge: true });

    setProfileData((prevData) => ({
      ...prevData,
      profileImage: downloadURL,
    }));
  };

  const validateFields = () => {
    let valid = true;
    const newErrors = { nickname: false, gender: false, birthday: false };

    if (!nickname) {
      newErrors.nickname = true;
      valid = false;
    }

    if (!gender) {
      newErrors.gender = true;
      valid = false;
    }

    if (!isAdult(birthday)) {
      newErrors.birthday = true;
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  // Функція для перевірки віку
  const isAdult = (dateOfBirth) => {
    const today = dayjs();
    const age = today.diff(dateOfBirth, "year");
    return age >= 18;
  };

  // Перевірка доступності Nickname
  const checkNicknameAvailability = async (nickname) => {
    const usersRef = collection(db, "Users");
    const q = query(usersRef, where("nickname", "==", nickname));
    const querySnapshot = await getDocs(q);

    // Перевірка, чи порожній результат або чи це поточний користувач
    return (
      querySnapshot.empty ||
      (querySnapshot.docs.length === 1 && querySnapshot.docs[0].id === user.uid)
    );
  };

  const saveProfileData = async () => {
    if (!validateFields()) {
      setError(t("emptyFieldsError"));
      setAlertSeverity("error");
      setAlertMessage(t("correctErrorsMessage"));
      setSnackBarOpen(true);
      return;
    }

    // Перевіряємо доступність Nickname
    const isAvailable = await checkNicknameAvailability(nickname);
    if (!isAvailable) {
      setAlertSeverity("error");
      setAlertMessage(t("alreadyTakenMessage"));
      setSnackBarOpen(true);
      return;
    }

    try {
      const userDocRef = doc(db, "Users", user.uid);
      await setDoc(
        userDocRef,
        {
          name,
          nickname,
          aboutMe,
          gender,
          // Зберігаємо дату як Timestamp
          birthday: Timestamp.fromDate(birthday.toDate()),
          isPrivate,
        },
        { merge: true }
      );

      await uploadProfileImage();

      setProfileData((prevData) => ({
        ...prevData,
        name,
        nickname,
        aboutMe,
        gender,
        birthday,
        isPrivate,
      }));

      setError("");
      setAlertSeverity("success");
      setAlertMessage(t("successMessage"));
      setSnackBarOpen(true);
    } catch (error) {
      setAlertSeverity("error");
      setAlertMessage(t("errorMessage"));
      setSnackBarOpen(true);
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSnackbarClose = () => {
    setSnackBarOpen(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="flex flex-col min-h-screen items-center justify-center -mt-28">
        <div className="flex justify-between w-full max-w-screen-lg">
          <div className="flex flex-col items-center w-1/3 mt-8">
            <Avatar
              className="mb-4"
              alt="User"
              src={imagePreview || profileData?.profileImage || "/noavatar.png"}
              sx={{ width: 200, height: 200 }}
            />
            <input
              style={{ display: "none" }}
              id="file-upload"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
            <label htmlFor="file-upload">
              <Button variant="contained" color="primary" component="span">
                <FaCloudUploadAlt size={17} className="mr-2" />
                {/* upload photo */}
                {t("addProfilePhoto")}
              </Button>
            </label>
            <Typography variant="h5" className="mt-5 font-bold">
              {/* {profileData?.name || "User Name"} */}
              {profileData?.name || t("userName")}
            </Typography>
            <Typography variant="h6" className="font-bold">
              {/* {profileData?.nickname || "NickName"} */}
              {profileData?.nickname || t("userNickname")}
            </Typography>
            <Rating className="mt-2" name="read-only" value={5} readOnly />
          </div>

          <div className="flex flex-col flex-grow gap-6 pl-8">
            {error && <Typography color="error">{error}</Typography>}
            <div className="flex gap-6">
              <Tooltip title={t("userNameTooltip")}>
                <TextField
                  // label="Name"
                  label={t("userName")}
                  variant="standard"
                  fullWidth
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Tooltip>
              <Tooltip title={t("userNicknameTooltip")}>
                <TextField
                  // label="Nickname"
                  label={t("userNickname")}
                  variant="standard"
                  fullWidth
                  value={nickname}
                  error={errors.nickname}
                  onChange={(e) => setNickname(e.target.value)}
                />
              </Tooltip>
            </div>

            <Tooltip title={t("userAboutMeTooltip")}>
              <TextField
                // label="About Me"
                label={t("userAboutMe")}
                variant="standard"
                fullWidth
                multiline
                value={aboutMe}
                onChange={(e) => setAboutMe(e.target.value)}
              />
            </Tooltip>

            <FormControl error={errors.gender}>
              <FormLabel>
                {/* Gender */}
                {t("userGender")}
              </FormLabel>
              <RadioGroup
                row
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <FormControlLabel
                  value="Male"
                  control={<Radio />}
                  // label="Male"
                  label={t("userGenderMale")}
                />
                <FormControlLabel
                  value="Female"
                  control={<Radio />}
                  // label="Female"
                  label={t("userGenderFemale")}
                />
              </RadioGroup>
            </FormControl>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DesktopDatePicker
                // label="Date of Birth"
                label={t("userDateOfBirth")}
                value={birthday}
                onChange={(newValue) => setBirthday(newValue)}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>

            <FormControlLabel
              control={
                <Switch
                  checked={isPrivate}
                  onChange={(e) => setIsPrivate(e.target.checked)}
                />
              }
              // label="Private Profile"
              label={t("userPrivateAccountSwitch")}
            />

            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={saveProfileData}
            >
              {/* Save Changes */}
              {t("saveChangesButton")}
            </Button>
          </div>
        </div>
      </div>

      <Snackbar
        open={snackBarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
      >
        <Alert severity={alertSeverity}>{alertMessage}</Alert>
      </Snackbar>
    </div>
  );
};

export default ProfilePage;
