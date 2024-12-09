"use client";

import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Header from "@/components/Header/Header";
import { useParams } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import {
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  getDoc,
} from "firebase/firestore";
import { useTranslations } from "next-intl";
import ProfileHeader from "@/components/OtherUserProfilePage/ProfileHeader";
import CommentsSection from "@/components/OtherUserProfilePage/CommentsSection";
import useProfileData from "@/hooks/otherUserProfilePage/useProfileData";
import useSnackbar from "@/hooks/otherUserProfilePage/useSnackbar";

const OtherUserProfilePage = () => {
  const t = useTranslations("Profile");
  const { id } = useParams();
  const {
    profileData,
    loading,
    isFollowing,
    setIsFollowing,
    comments,
    setComments,
    rating,
    handleRatingChange,
  } = useProfileData(id);
  const {
    snackBarOpen,
    alertMessage,
    alertSeverity,
    handleSnackbarClose,
    showAlert,
  } = useSnackbar();

  const handleFollowToggle = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      showAlert(t("notLoggedInMessage"));
      return;
    }

    const currentUserDoc = doc(db, "Users", currentUser.uid);
    const currentUserSnapshot = await getDoc(currentUserDoc);

    if (!currentUserSnapshot.exists()) {
      showAlert(t("userDoesntExistMessage"));
      return;
    }

    const currentUserData = currentUserSnapshot.data();
    const isPremium = currentUserData.isPremium;
    const travelCompanions = currentUserData.travelCompanions || [];

    if (!isPremium && !isFollowing && travelCompanions.length >= 1) {
      showAlert(t("followLimitMessage"));
      return;
    }

    try {
      if (isFollowing) {
        await updateDoc(currentUserDoc, {
          travelCompanions: arrayRemove(id),
        });
        setIsFollowing(false);
      } else {
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
    <div className="pb-5">
      <Header />
      <div className="flex flex-col items-center justify-center mt-20">
        <ProfileHeader
          profileData={profileData}
          isFollowing={isFollowing}
          handleFollowToggle={handleFollowToggle}
          rating={rating}
          handleRatingChange={handleRatingChange}
        />
        <CommentsSection
          id={id}
          comments={comments}
          setComments={setComments}
          showAlert={showAlert}
        />
        <Snackbar
          open={snackBarOpen}
          autoHideDuration={3000}
          onClose={handleSnackbarClose}
        >
          <Alert severity={alertSeverity}>{alertMessage}</Alert>
        </Snackbar>
      </div>
    </div>
  );
};

export default OtherUserProfilePage;
