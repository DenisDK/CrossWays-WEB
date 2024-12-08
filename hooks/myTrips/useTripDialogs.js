import { useState } from "react";

const useTripDialogs = () => {
  const [openCreate, setOpenCreate] = useState(false);
  const [openDetails, setOpenDetails] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedTripId, setSelectedTripId] = useState(null);

  const handleClickOpenCreate = () => setOpenCreate(true);
  const handleCloseCreate = () => setOpenCreate(false);

  const handleOpenDetails = (tripId) => {
    setSelectedTripId(tripId);
    setOpenDetails(true);
  };
  const handleCloseDetails = () => setOpenDetails(false);

  const handleOpenEdit = (tripId) => {
    setSelectedTripId(tripId);
    setOpenEdit(true);
  };
  const handleCloseEdit = () => setOpenEdit(false);

  const handleOpenDelete = (tripId) => {
    setSelectedTripId(tripId);
    setOpenDelete(true);
  };
  const handleCloseDelete = () => setOpenDelete(false);

  return {
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
  };
};

export default useTripDialogs;
