"use client";

import { Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import Nav from "./Nav/Nav";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  arrayRemove,
  arrayUnion,
} from "firebase/firestore";
import ProfileInfo from "./ProfileInfo";
import LanguageSelector from "./LanguageSelector/LanguageSelector";
import NotificationDrawer from "./NotificationDrawer/NotificationDrawer";

const Header = () => {
  const t = useTranslations("Navigation");
  const [isUser, setIsUser] = useState(auth.currentUser);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [requests, setRequests] = useState([]);
  const [trips, setTrips] = useState([]);

  const fetchUserDetails = async (userId) => {
    const userDocRef = doc(db, "Users", userId);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      return userDoc.data();
    }
    return null;
  };

  const fetchRequestsAndTrips = async (userId) => {
    const q = query(collection(db, "Trips"), where("creatorId", "==", userId));
    const querySnapshot = await getDocs(q);
    const tripsList = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setTrips(tripsList);

    const requestsList = await Promise.all(
      tripsList.flatMap(async (trip) => {
        return await Promise.all(
          trip.requests.map(async (userId) => {
            const userDetails = await fetchUserDetails(userId);
            return {
              tripId: trip.id,
              userId,
              userAvatar: userDetails?.profileImage || "",
              userName: userDetails?.name || "",
            };
          })
        );
      })
    );
    setRequests(requestsList.flat());
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsUser(true);
        fetchRequestsAndTrips(user.uid);
      } else {
        setIsUser(false);
        setTrips([]);
        setRequests([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setIsDrawerOpen(open);
  };

  const handleAcceptRequest = async (tripId, userId) => {
    const tripDocRef = doc(db, "Trips", tripId);
    const userDocRef = doc(db, "Users", userId);

    // Оновлення списку учасників тріпа
    await updateDoc(tripDocRef, {
      requests: arrayRemove(userId),
      participants: arrayUnion(userId),
    });

    // Оновлення activeTravels користувача
    await updateDoc(userDocRef, {
      activeTravels: arrayUnion(tripId),
    });

    // Оновлюємо стан requests та trips
    setRequests((prevRequests) =>
      prevRequests.filter((request) => request.userId !== userId)
    );
    setTrips((prevTrips) =>
      prevTrips.map((trip) =>
        trip.id === tripId
          ? { ...trip, requests: trip.requests.filter((id) => id !== userId) }
          : trip
      )
    );
  };

  const handleRejectRequest = async (tripId, userId) => {
    const tripDocRef = doc(db, "Trips", tripId);
    await updateDoc(tripDocRef, {
      requests: arrayRemove(userId),
    });
    // Оновлюємо стан requests та trips
    setRequests((prevRequests) =>
      prevRequests.filter((request) => request.userId !== userId)
    );
    setTrips((prevTrips) =>
      prevTrips.map((trip) =>
        trip.id === tripId
          ? { ...trip, requests: trip.requests.filter((id) => id !== userId) }
          : trip
      )
    );
  };

  return (
    <div className="max-w-screen-xl mx-auto flex justify-between items-center my-5 px-2">
      {isUser ? (
        <Link href={"/Main"}>
          <div className="text-[#876447] font-bold text-4xl flex">
            CrossWays
            <Image
              src="/airplanw-ico.svg"
              alt="Airplane icon"
              width={30}
              height={30}
            />
          </div>
        </Link>
      ) : (
        <Link href={"/"}>
          <div className="text-[#876447] font-bold text-4xl flex">
            CrossWays
            <Image
              src="/airplanw-ico.svg"
              alt="Airplane icon"
              width={30}
              height={30}
            />
          </div>
        </Link>
      )}

      {isUser ? <Nav /> : ""}

      <div>
        {isUser ? (
          <div className="flex justify-between items-center">
            <LanguageSelector />
            <ProfileInfo />
            <NotificationDrawer
              isDrawerOpen={isDrawerOpen}
              toggleDrawer={toggleDrawer}
              requests={requests}
              trips={trips}
              handleAcceptRequest={handleAcceptRequest}
              handleRejectRequest={handleRejectRequest}
            />
          </div>
        ) : (
          <div className="">
            <LanguageSelector />
            <Link href="/Join-Now">
              <Button className="bg-[#5C6D67] ml-5" variant="contained">
                {t("joinNowButton")}
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
