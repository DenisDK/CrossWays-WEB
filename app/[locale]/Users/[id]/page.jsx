"use client";

import Header from "@/components/Header/Header";
import React, { useEffect, useState } from "react";
import Avatar from "@mui/material/Avatar";
import Rating from "@mui/material/Rating";
import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useParams } from "next/navigation";
import { Alert, Button, CircularProgress, Snackbar } from "@mui/material";
import { GiLaurelCrown } from "react-icons/gi";
import { useTranslations } from "next-intl";

const OtherUserProfilePage = () => {
  const t = useTranslations("Profile");
  const { id } = useParams(); // ID користувача, на якого ви дивитесь
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);

  // Error alert
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

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!id) return;
      const userDoc = doc(db, "Users", id);
      const userSnapshot = await getDoc(userDoc);

      if (userSnapshot.exists()) {
        setProfileData(userSnapshot.data());
      }

      // Отримуємо UID поточного користувача
      const currentUser = auth.currentUser;
      if (!currentUser) {
        console.error("User not logged in");
        setLoading(false);
        return;
      }

      const currentUserDoc = doc(db, "Users", currentUser.uid);
      const currentUserSnapshot = await getDoc(currentUserDoc);

      if (
        currentUserSnapshot.exists() &&
        currentUserSnapshot.data().travelCompanions?.includes(id)
      ) {
        setIsFollowing(true);
      }

      setLoading(false);
    };

    fetchProfileData();
  }, [id]);

  const calculateAge = (birthday) => {
    const birthDate = birthday.toDate();
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  const handleFollowToggle = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      showAlert(t("notLoggedInMessage"));
      return;
    }

    const currentUserDoc = doc(db, "Users", currentUser.uid); // Документ поточного користувача
    const currentUserSnapshot = await getDoc(currentUserDoc);

    if (!currentUserSnapshot.exists()) {
      showAlert(t("userDoesntExistMessage"));
      return;
    }

    const currentUserData = currentUserSnapshot.data();
    const isPremium = currentUserData.isPremium;
    const travelCompanions = currentUserData.travelCompanions || [];

    // Перевірка на кількість підписок для непреміум користувачів (не більше одного, можна змінити)
    if (!isPremium && !isFollowing && travelCompanions.length >= 1) {
      showAlert(t("followLimitMessage"));
      return;
    }

    try {
      if (isFollowing) {
        // Видалити ID з `travelCompanions`
        await updateDoc(currentUserDoc, {
          travelCompanions: arrayRemove(id),
        });
        setIsFollowing(false);
      } else {
        // Додати ID до `travelCompanions`
        await updateDoc(currentUserDoc, {
          travelCompanions: arrayUnion(id),
        });
        setIsFollowing(true);
      }
    } catch (error) {
      showAlert(t("updatingCompanionsUpdateMessage") + error.message);
    }
  };

  if (loading)
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        <CircularProgress />
      </div>
    );

  return (
    <div>
      <Header />
      <div className="flex flex-col items-center justify-center mt-48">
        <div className="flex justify-between max-w-screen-lg">
          <div className="flex flex-col items-center min-w-[300px] bg-[#e9b08254] rounded-xl p-5">
            <Avatar
              className="mb-4"
              alt={profileData?.name}
              src={profileData?.profileImage || "/noavatar.png"}
              sx={{ width: 200, height: 200 }}
            />
            <div className="text-2xl font-bold">
              {profileData?.name || "User Name"}
            </div>
            <div className="text-xl font-bold">
              {profileData?.nickname || "Nickname"}
            </div>
            <Rating className="mt-2" name="read-only" value={5} readOnly />

            {isFollowing ? (
              <Button
                className="mt-5 w-40"
                variant="contained"
                color="error"
                onClick={handleFollowToggle}
              >
                {t("otherUserUnFollowButton")}
              </Button>
            ) : (
              <Button
                className="mt-5 w-40"
                variant="contained"
                onClick={handleFollowToggle}
              >
                {t("otherUserFollowButton")}
              </Button>
            )}
          </div>

          <div className="flex flex-col flex-grow gap-6 pl-6">
            <div className="bg-[#e9b08254] p-5 rounded-xl w-[700px]">
              <span className="font-bold text-2xl mr-3">
                {t("userAboutMe")}:
              </span>
              <span className="text-xl">{profileData?.aboutMe || "N/A"}</span>
            </div>
            <div className="bg-[#e9b08254] p-5 h-full flex flex-col gap-6 rounded-xl">
              <div>
                <span className="font-bold text-2xl mr-3">
                  {t("userGender")}:
                </span>
                <span className="text-xl">{profileData?.gender || "N/A"}</span>
              </div>
              <div>
                <span className="font-bold text-2xl mr-3">
                  {t("userDateOfBirth")}:
                </span>
                <span className="text-xl">
                  {profileData?.birthday?.toDate().toLocaleDateString() ||
                    "N/A"}
                </span>
              </div>
              <div>
                <span className="font-bold text-2xl mr-3">
                  {t("otherUserAge")}:
                </span>
                <span className="text-xl">
                  {profileData?.birthday
                    ? calculateAge(profileData.birthday)
                    : "N/A"}
                </span>
              </div>
              <div>
                <span className="font-bold text-2xl mr-3">
                  {t("otherUserPrivacy")}:
                </span>
                <span className="text-xl">
                  {profileData?.isPrivate
                    ? t("otherUserPrivacyPrivate")
                    : t("otherUserPrivacyPublic")}
                </span>
              </div>
              <div className="flex items-center">
                <span className="font-bold text-2xl mr-3">
                  {t("otherUserVipStatus")}:
                </span>
                <span className="text-xl flex">
                  {profileData?.isPremium ? (
                    <span className="flex items-center">
                      <span className="mr-2">{t("otherUserHasVip")}</span>
                      <GiLaurelCrown size={40} color="orange" />
                    </span>
                  ) : (
                    t("otherUserNoVip")
                  )}
                </span>
              </div>
            </div>
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

export default OtherUserProfilePage;
