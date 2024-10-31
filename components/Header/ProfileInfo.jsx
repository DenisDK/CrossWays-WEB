"use client";

import React, { useEffect, useState } from "react";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { IoIosArrowDown } from "react-icons/io";
import { RiVipCrownFill } from "react-icons/ri";
import { PiSignOutBold } from "react-icons/pi";
import { FaUserCircle } from "react-icons/fa";
import { GiCommercialAirplane } from "react-icons/gi";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { ListItemIcon } from "@mui/material";
import Link from "next/link";
import { doc, onSnapshot } from "firebase/firestore";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser({
          displayName: currentUser.displayName,
          photoURL: currentUser.photoURL,
        });

        // Підписка на зміни користувача в Firestore
        const userDocRef = doc(db, "Users", currentUser.uid);
        const unsubscribeFirestore = onSnapshot(userDocRef, (userDoc) => {
          if (userDoc.exists()) {
            setProfileImage(userDoc.data().profileImage);
            setUser((prev) => ({
              ...prev,
              displayName: userDoc.data().name || currentUser.displayName, // Оновлення displayName, якщо змінилося
            }));
          }
        });

        return () => {
          unsubscribeFirestore(); // Відписка від Firestore
        };
      } else {
        setUser(null);
        setProfileImage(null);
      }
    });

    return () => unsubscribeAuth(); // Відписка від auth
  }, []);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = async () => {
    await signOut(auth);
    handleMenuClose();
  };

  return (
    <div className="flex items-center">
      {user ? (
        <>
          <div
            className="flex items-center cursor-pointer"
            onClick={handleMenuOpen}
          >
            <Avatar
              alt={user.displayName}
              src={profileImage || user.photoURL || "/defaultAvatar.png"}
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
            <Link href={"/Main"}>
              <MenuItem>
                <ListItemIcon>
                  <RiVipCrownFill />
                </ListItemIcon>
                VIP status
              </MenuItem>
            </Link>
            <MenuItem
              className="text-red-700 font-bold"
              onClick={handleSignOut}
            >
              <ListItemIcon>
                <PiSignOutBold className="text-red-700 font-bold" />
              </ListItemIcon>
              Sign Out
            </MenuItem>
          </Menu>
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
