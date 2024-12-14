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
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  IconButton,
  Divider,
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
import { FaTrash } from "react-icons/fa";
import { Link } from "@/i18n/routing";
import useComments from "@/hooks/profile/useComments"; // Імпорт нового хука
import useSubscriptions from "@/hooks/profile/useSubscriptions"; // Імпорт нового хука
import useAverageRating from "@/hooks/profile/useAverageRating"; // Імпорт нового хука

const ProfilePage = () => {
  const t = useTranslations("Profile");
  const [user, setUser] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");
  const [aboutMe, setAboutMe] = useState("");
  const [gender, setGender] = useState("");
  const [birthday, setBirthday] = useState(null);
  const [isPrivate, setIsPrivate] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({
    nickname: false,
    gender: false,
    birthday: false,
  });
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isPremium, setIsPremium] = useState(false);
  const { comments } = useComments(user);
  const { travelCompanions, handleRemoveCompanion } = useSubscriptions(user);
  const { averageRating } = useAverageRating(user); // Використання нового хука
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
          if (data.birthday) {
            setBirthday(dayjs(data.birthday.toDate()));
          }
          setIsPrivate(data.isPrivate);
          setIsPremium(data.isPremium);
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

  const isAdult = (dateOfBirth) => {
    const today = dayjs();
    const age = today.diff(dateOfBirth, "year");
    return age >= 18;
  };

  const checkNicknameAvailability = async (nickname) => {
    const usersRef = collection(db, "Users");
    const q = query(usersRef, where("nickname", "==", nickname));
    const querySnapshot = await getDocs(q);

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
      const isGif = file.type === "image/gif";
      if (isGif && !isPremium) {
        setAlertSeverity("error");
        setAlertMessage("Only premium users can upload GIF images.");
        setSnackBarOpen(true);
        return;
      }

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
      <div className="flex flex-col min-h-screen items-center justify-center mt-20">
        <div className="flex justify-between w-full max-w-screen-xl gap-5">
          <div className="flex flex-col items-center w-1/5 mt-8">
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
                {t("addProfilePhoto")}
              </Button>
            </label>
            <Typography variant="h5" className="mt-5 font-bold">
              {profileData?.name || t("userName")}
            </Typography>
            <Typography variant="h6" className="font-bold">
              {profileData?.nickname || t("userNickname")}
            </Typography>
            <div className="flex items-center mt-2">
              <Rating name="read-only" value={averageRating} readOnly />
              <Typography variant="h6" className="ml-2">
                {averageRating.toFixed(1)}
              </Typography>
            </div>
          </div>

          <div className="flex flex-col flex-grow gap-6">
            {error && <Typography color="error">{error}</Typography>}
            <div className="flex gap-6">
              <Tooltip title={t("userNameTooltip")}>
                <TextField
                  label={t("userName")}
                  variant="standard"
                  fullWidth
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Tooltip>
              <Tooltip title={t("userNicknameTooltip")}>
                <TextField
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
                label={t("userAboutMe")}
                variant="standard"
                fullWidth
                multiline
                value={aboutMe}
                onChange={(e) => setAboutMe(e.target.value)}
              />
            </Tooltip>

            <FormControl error={errors.gender}>
              <FormLabel>{t("userGender")}</FormLabel>
              <RadioGroup
                row
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <FormControlLabel
                  value="Male"
                  control={<Radio />}
                  label={t("userGenderMale")}
                />
                <FormControlLabel
                  value="Female"
                  control={<Radio />}
                  label={t("userGenderFemale")}
                />
              </RadioGroup>
            </FormControl>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DesktopDatePicker
                label={t("userDateOfBirth")}
                value={birthday}
                onChange={(newValue) => setBirthday(newValue)}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>

            {isPremium && (
              <FormControlLabel
                control={
                  <Switch
                    checked={isPrivate}
                    onChange={(e) => setIsPrivate(e.target.checked)}
                  />
                }
                label={t("userPrivateAccountSwitch")}
              />
            )}

            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={saveProfileData}
            >
              {t("saveChangesButton")}
            </Button>
          </div>
          <div className="flex flex-col w-1/4 mt-8">
            <div className="text-lg font-bold pl-4">
              {t("usersSubscriptions")}
            </div>
            {travelCompanions.length === 0 ? (
              <div className="text-gray-500 italic mt-4 pl-4">
                {t("userHasNoSubs")}
              </div>
            ) : (
              <List>
                {travelCompanions
                  .filter((companion) => !companion.isPrivate)
                  .map((companion) => (
                    <ListItem key={companion.uid}>
                      <ListItemAvatar>
                        <Link href={`/Users/${companion.uid}`}>
                          <Avatar
                            src={companion.profileImage || "/noavatar.png"}
                            alt={companion.name}
                          />
                        </Link>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Link href={`/Users/${companion.uid}`}>
                            <span className="cursor-pointer font-bold hover:underline">
                              {companion.name}
                            </span>
                          </Link>
                        }
                        secondary={companion.nickname}
                      />
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => handleRemoveCompanion(companion.uid)}
                        className="text-gray-500 hover:text-red-700 transition-colors"
                      >
                        <FaTrash size={18} />
                      </IconButton>
                    </ListItem>
                  ))}
              </List>
            )}
          </div>
        </div>
        <div className="w-full max-w-screen-xl mt-10 px-10">
          <Typography variant="h6" className="font-bold mb-4">
            {t("userCommentsSection")}
          </Typography>
          <List>
            {comments.map((comment) => (
              <React.Fragment key={comment.id}>
                <ListItem alignItems="flex-start">
                  <ListItemText
                    primary={
                      <Typography variant="h6" fontWeight="bold">
                        {comment.authorName}
                      </Typography>
                    }
                    secondary={
                      <>
                        <Typography
                          sx={{ display: "inline" }}
                          component="span"
                          variant="body1"
                          color="text.primary"
                        >
                          {comment.text}
                        </Typography>
                        <br />
                        <Typography variant="caption" color="text.secondary">
                          {dayjs(comment.createdAt.toDate()).format(
                            "DD/MM/YYYY"
                          )}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
                <Divider variant="inset" component="li" />
              </React.Fragment>
            ))}
          </List>
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
