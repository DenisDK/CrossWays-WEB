"use client";

import Header from "@/components/Header/Header";
import PopupForm from "@/components/PopupForm/PopupForm";
import { Fab } from "@mui/material";
import React, { useState } from "react";

// Icons
import { IoMdAdd } from "react-icons/io";

const TripsPage = () => {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

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
    </div>
  );
};

export default TripsPage;
