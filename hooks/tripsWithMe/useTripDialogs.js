import { useState } from "react";

const useTripDialogs = () => {
  const [openDetails, setOpenDetails] = useState(false);
  const [selectedTripId, setSelectedTripId] = useState(null);

  const handleOpenDetails = (tripId) => {
    setSelectedTripId(tripId);
    setOpenDetails(true);
  };

  const handleCloseDetails = () => {
    setOpenDetails(false);
  };

  return {
    openDetails,
    selectedTripId,
    handleOpenDetails,
    handleCloseDetails,
  };
};

export default useTripDialogs;
