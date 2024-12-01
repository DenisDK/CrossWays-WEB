"use client";

import React, { useEffect, useState } from "react";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

import { ListItemIcon } from "@mui/material";

// Icons
import { IoIosArrowDown } from "react-icons/io";
import { RiVipCrownFill } from "react-icons/ri";
import { PiSignOutBold } from "react-icons/pi";
import { FaUserCircle } from "react-icons/fa";
import { GiCommercialAirplane } from "react-icons/gi";
import { MdDelete } from "react-icons/md";
import { MdModeOfTravel } from "react-icons/md";

// Firebase
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { deleteUserAndData } from "@/lib/deleteUser";

const UserProfile = () => {
  const t = useTranslations("ProfileInfo");
  const [user, setUser] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openSignOutDialog, setOpenSignOutDialog] = useState(false);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser({
          displayName: currentUser.displayName,
          photoURL: currentUser.photoURL,
        });

        const userDocRef = doc(db, "Users", currentUser.uid);
        const unsubscribeFirestore = onSnapshot(userDocRef, (userDoc) => {
          if (userDoc.exists()) {
            setProfileImage(userDoc.data().profileImage);
            setUser((prev) => ({
              ...prev,
              displayName: userDoc.data().name || currentUser.displayName,
            }));
          }
        });

        return () => {
          unsubscribeFirestore();
        };
      } else {
        setUser(null);
        setProfileImage(null);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteAccount = async () => {
    const result = await deleteUserAndData();
    if (result.success) {
      handleMenuClose();
    } else {
      console.error("Failed to delete account:", result.error);
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
    handleMenuClose();
  };

  return (
    <div className="flex items-center ml-5">
      {user ? (
        <>
          <div
            className="flex items-center cursor-pointer"
            onClick={handleMenuOpen}
          >
            <Avatar
              alt={user.displayName}
              src={profileImage || user.photoURL || "/noavatar.png"}
            />
            <span className="ml-2 text-[#876447] text-xl">
              {user.displayName || "User"}
            </span>
            <IoIosArrowDown size={20} className="text-[#876447] ml-1" />
          </div>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            onMouseLeave={handleMenuClose}
            className="mt-2"
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <Link href={"/Profile"}>
              <MenuItem>
                <ListItemIcon>
                  <FaUserCircle />
                </ListItemIcon>
                {t("usersProfile")}
              </MenuItem>
            </Link>
            <Link href={"/MyTrips"}>
              <MenuItem>
                <ListItemIcon>
                  <GiCommercialAirplane />
                </ListItemIcon>
                {t("usersTrips")}
              </MenuItem>
            </Link>
            <Link href={"/TripsWithMe"}>
              <MenuItem>
                <ListItemIcon>
                  <MdModeOfTravel />
                </ListItemIcon>
                {t("usersTripsParticipation")}
              </MenuItem>
            </Link>
            <Link href={"/Premium"}>
              <MenuItem>
                <ListItemIcon>
                  <RiVipCrownFill />
                </ListItemIcon>
                {t("usersVipStatus")}
              </MenuItem>
            </Link>
            <MenuItem
              className="text-red-700 font-bold"
              onClick={() => setOpenDeleteDialog(true)}
            >
              <ListItemIcon>
                <MdDelete className="text-red-700 font-bold" />
              </ListItemIcon>
              {t("deleteAccount")}
            </MenuItem>
            <MenuItem
              className="text-red-700 font-bold"
              onClick={() => setOpenSignOutDialog(true)}
            >
              <ListItemIcon>
                <PiSignOutBold className="text-red-700 font-bold" />
              </ListItemIcon>
              {t("signOut")}
            </MenuItem>
          </Menu>

          {/* Dialog for deleting account */}
          <Dialog
            open={openDeleteDialog}
            onClose={() => setOpenDeleteDialog(false)}
          >
            <DialogTitle>{t("deleteAccountDialogTitle")}</DialogTitle>
            <DialogContent>
              <DialogContentText>
                {t("deleteAccountDialogParagraph")}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => setOpenDeleteDialog(false)}
                className="font-bold"
                color="success"
              >
                {t("deleteAccountDialogCancelButton")}
              </Button>
              <Button
                onClick={handleDeleteAccount}
                className="font-bold"
                color="error"
                autoFocus
              >
                {t("deleteAccountDialogConfirmButton")}
              </Button>
            </DialogActions>
          </Dialog>

          {/* Dialog for signing out */}
          <Dialog
            open={openSignOutDialog}
            onClose={() => setOpenSignOutDialog(false)}
          >
            <DialogTitle>{t("signOutDialogTitle")}</DialogTitle>
            <DialogContent>
              <DialogContentText>
                {t("signOutDialogParagraph")}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => setOpenSignOutDialog(false)}
                className="font-bold"
                color="success"
              >
                {t("signOutCancelButton")}
              </Button>
              <Button
                onClick={handleSignOut}
                className="font-bold"
                color="error"
                autoFocus
              >
                {t("signOutConfirmButton")}
              </Button>
            </DialogActions>
          </Dialog>
        </>
      ) : (
        <>
          <Avatar alt="Гість" />
          <span className="text-[#876447]">Гість</span>
        </>
      )}
    </div>
  );
};

export default UserProfile;
