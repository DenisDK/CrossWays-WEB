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

// Firebase
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { deleteUserAndData } from "@/lib/deleteUser";

const UserProfile = () => {
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
                My profile
              </MenuItem>
            </Link>
            <Link href={"/Main"}>
              <MenuItem>
                <ListItemIcon>
                  <GiCommercialAirplane />
                </ListItemIcon>
                My trips
              </MenuItem>
            </Link>
            <Link href={"/Premium"}>
              <MenuItem>
                <ListItemIcon>
                  <RiVipCrownFill />
                </ListItemIcon>
                VIP status
              </MenuItem>
            </Link>
            <MenuItem
              className="text-red-700 font-bold"
              onClick={() => setOpenDeleteDialog(true)}
            >
              <ListItemIcon>
                <MdDelete className="text-red-700 font-bold" />
              </ListItemIcon>
              Delete Account
            </MenuItem>
            <MenuItem
              className="text-red-700 font-bold"
              onClick={() => setOpenSignOutDialog(true)}
            >
              <ListItemIcon>
                <PiSignOutBold className="text-red-700 font-bold" />
              </ListItemIcon>
              Sign Out
            </MenuItem>
          </Menu>

          {/* Dialog for deleting account */}
          <Dialog
            open={openDeleteDialog}
            onClose={() => setOpenDeleteDialog(false)}
          >
            <DialogTitle>Confirm Delete Account</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Are you sure you want to delete your account? This action is
                irreversible.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => setOpenDeleteDialog(false)}
                className="font-bold"
                color="success"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDeleteAccount}
                className="font-bold"
                color="error"
                autoFocus
              >
                Confirm
              </Button>
            </DialogActions>
          </Dialog>

          {/* Dialog for signing out */}
          <Dialog
            open={openSignOutDialog}
            onClose={() => setOpenSignOutDialog(false)}
          >
            <DialogTitle>Confirm Sign Out</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Are you sure you want to sign out?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => setOpenSignOutDialog(false)}
                className="font-bold"
                color="success"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSignOut}
                className="font-bold"
                color="error"
                autoFocus
              >
                Sign Out
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
