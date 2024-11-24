"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  CircularProgress,
  Typography,
  Box,
  Avatar,
} from "@mui/material";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

const TripDetailsDialog = ({ open, onClose, tripId }) => {
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (tripId) {
      const fetchTripDetails = async () => {
        try {
          const tripDocRef = doc(db, "Trips", tripId);
          const tripDoc = await getDoc(tripDocRef);
          if (tripDoc.exists()) {
            setTrip(tripDoc.data());
          } else {
            console.error("Trip not found");
          }
        } catch (error) {
          console.error("Failed to fetch trip details:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchTripDetails();
    }
  }, [tripId]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle className="text-[#876447]">Trip Details</DialogTitle>
      <DialogContent>
        {loading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="50vh"
          >
            <CircularProgress />
          </Box>
        ) : trip ? (
          <Box display="flex">
            <Box mr={4}>
              <Avatar
                variant="square"
                sx={{ width: 300, height: 400 }}
                src={trip.imageUrl}
                alt={trip.title}
                className="rounded"
              />
            </Box>
            <Box className="">
              <Typography className="text-[#876447]" variant="h4">
                <span className="font-bold mr-2">Title:</span>
                {trip.title}
              </Typography>
              <Typography
                className="text-[#876447] text-xl mt-2"
                variant="body2"
              >
                <span className="font-bold mr-2">Country:</span> {trip.country}
              </Typography>
              <Typography
                className="text-[#876447] text-xl mt-2"
                variant="body2"
              >
                <span className="font-bold mr-2">Member limit:</span>{" "}
                {trip.memberLimit}
              </Typography>
              <Typography
                className="text-[#876447] text-xl mt-2"
                variant="body2"
              >
                <span className="font-bold mr-2">From:</span>{" "}
                {trip.from.toDate().toDateString()}
              </Typography>
              <Typography
                className="text-[#876447] text-xl mt-2"
                variant="body2"
              >
                <span className="font-bold mr-2">To:</span>{" "}
                {trip.to.toDate().toDateString()}
              </Typography>
              <Typography
                className="text-[#876447] text-xl mt-2"
                variant="body1"
              >
                <span className="font-bold mr-2">Description:</span>{" "}
                {trip.description}
              </Typography>
            </Box>
          </Box>
        ) : (
          <Typography variant="h6">Trip not found</Typography>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TripDetailsDialog;
