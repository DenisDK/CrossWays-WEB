"use client";
import React from "react";
import {
  Fab,
  Card,
  CardMedia,
  CardContent,
  Typography,
  CircularProgress,
  Box,
  Button,
} from "@mui/material";
import { IoMdAdd } from "react-icons/io";
import { useTranslations } from "next-intl";
import Header from "@/components/Header/Header";
import PopupForm from "@/components/PopupForm/PopupForm";
import TripDetailsDialog from "@/components/PopupForm/TripDetailsDialog";
import EditTripDialog from "@/components/PopupForm/EditTripDialog";
import DeleteConfirmationDialog from "@/components/PopupForm/DeleteConfirmationDialog";
import useTripDialogs from "@/hooks/myTrips/useTripDialogs";
import deleteTrip from "@/lib/deleteTrips";
import useTrips from "@/hooks/myTrips/useTrips";
import { doc, updateDoc, arrayRemove } from "firebase/firestore";
import { db } from "@/lib/firebase";

const TripsPage = () => {
  const t = useTranslations("Trips");
  const {
    openCreate,
    openDetails,
    openEdit,
    openDelete,
    selectedTripId,
    handleClickOpenCreate,
    handleCloseCreate,
    handleOpenDetails,
    handleCloseDetails,
    handleOpenEdit,
    handleCloseEdit,
    handleOpenDelete,
    handleCloseDelete,
  } = useTripDialogs();
  const { trips, loading, user, fetchTrips } = useTrips();

  const handleConfirmDelete = async () => {
    try {
      await deleteTrip(selectedTripId);

      const userDocRef = doc(db, "Users", user.uid);
      await updateDoc(userDocRef, {
        activeTravels: arrayRemove(selectedTripId),
      });

      fetchTrips(user.uid);
      handleCloseDelete();
    } catch (error) {
      console.error("Error deleting trip: ", error);
    }
  };

  return (
    <div className="relative">
      <Header />
      <Fab
        className="fixed bottom-5 right-5"
        color="primary"
        aria-label="add"
        onClick={handleClickOpenCreate}
      >
        <IoMdAdd size={28} />
      </Fab>
      <PopupForm open={openCreate} handleClose={handleCloseCreate} />
      <TripDetailsDialog
        open={openDetails}
        onClose={handleCloseDetails}
        tripId={selectedTripId}
      />
      <EditTripDialog
        open={openEdit}
        handleClose={handleCloseEdit}
        tripId={selectedTripId}
      />
      <DeleteConfirmationDialog
        open={openDelete}
        handleClose={handleCloseDelete}
        handleConfirm={handleConfirmDelete}
      />
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
                      <Button
                        variant="text"
                        color="primary"
                        onClick={() => handleOpenEdit(trip.id)}
                      >
                        {t("tripChange")}
                      </Button>
                      <Button
                        variant="text"
                        color="error"
                        onClick={() => handleOpenDelete(trip.id)}
                      >
                        {t("tripDeleteButton")}
                      </Button>
                    </Box>
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
