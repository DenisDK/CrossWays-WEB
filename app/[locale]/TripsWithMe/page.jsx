"use client";

import React from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  CircularProgress,
  Box,
  Button,
} from "@mui/material";
import Header from "@/components/Header/Header";
import TripDetailsDialog from "@/components/PopupForm/TripDetailsDialog";
import { useTranslations } from "next-intl";
import useTripsWithMe from "@/hooks/tripsWithMe/useTripsWithMe";
import useTripDialogs from "@/hooks/tripsWithMe/useTripDialogs";

const TripsWithMePage = () => {
  const t = useTranslations("Trips");
  const { trips, loading } = useTripsWithMe();
  const { openDetails, selectedTripId, handleOpenDetails, handleCloseDetails } =
    useTripDialogs();

  return (
    <>
      <Header />
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
                    <Typography
                      className="px-2"
                      gutterBottom
                      variant="h5"
                      component="div"
                    >
                      {trip.title}
                    </Typography>
                    <Typography
                      className="px-2 font-bold mb-2 text-base"
                      variant="body2"
                      color="text.secondary"
                    >
                      {trip.country}
                    </Typography>
                    <Typography
                      className="px-2"
                      variant="body2"
                      color="text.secondary"
                    >
                      {trip.description.substring(0, 100)}...
                    </Typography>
                    <Box
                      mt={2}
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Button
                        variant="text"
                        color="primary"
                        onClick={() => handleOpenDetails(trip.id)}
                      >
                        {t("tripDetails")}
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        )}
      </div>
      <TripDetailsDialog
        open={openDetails}
        onClose={handleCloseDetails}
        tripId={selectedTripId}
      />
    </>
  );
};

export default TripsWithMePage;
