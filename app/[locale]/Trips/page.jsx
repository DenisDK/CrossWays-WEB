"use client";

import Header from "@/components/Header/Header";
import PopupForm from "@/components/PopupForm/PopupForm";
import {
  Fab,
  Card,
  CardMedia,
  CardContent,
  Typography,
  CircularProgress,
  Box,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { IoMdAdd } from "react-icons/io";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

const TripsPage = () => {
  const [open, setOpen] = useState(false);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const fetchTrips = async (userId) => {
    setLoading(true);
    const q = query(collection(db, "Trips"), where("creatorId", "==", userId));
    const querySnapshot = await getDocs(q);
    const tripsList = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setTrips(tripsList);
    setLoading(false);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetchTrips(currentUser.uid);
      } else {
        setUser(null);
        setTrips([]);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!open && user) {
      fetchTrips(user.uid);
    }
  }, [open, user]);

  return (
    <div className="relative">
      <Header />
      <Fab
        className="fixed bottom-5 right-5"
        color="primary"
        aria-label="add"
        onClick={handleClickOpen}
      >
        <IoMdAdd size={28} />
      </Fab>
      <PopupForm open={open} handleClose={handleClose} />
      <div className="max-w-screen-xl mx-auto pt-28 pb-10">
        {loading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="50vh"
          >
            <CircularProgress />
          </Box>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {trips.map((trip) => (
              <div key={trip.id} className="flex flex-col h-full">
                <Card className="flex flex-col h-full">
                  <CardMedia
                    component="img"
                    height="140"
                    image={trip.imageUrl}
                    alt={trip.title}
                  />
                  <CardContent className="flex-grow">
                    <Typography gutterBottom variant="h5" component="div">
                      {trip.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {trip.country}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {trip.description.substring(0, 100)}...
                    </Typography>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TripsPage;
