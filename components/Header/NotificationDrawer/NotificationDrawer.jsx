import React from "react";
import { Drawer, Badge } from "@mui/material";
import { FaBell } from "react-icons/fa";

const NotificationDrawer = ({ isDrawerOpen, toggleDrawer }) => {
  return (
    <>
      <Badge
        className="cursor-pointer ml-2"
        badgeContent={1}
        color="primary"
        onClick={toggleDrawer(true)}
      >
        <FaBell color="#2e2e2e" size={20} />
      </Badge>
      <Drawer anchor="right" open={isDrawerOpen} onClose={toggleDrawer(false)}>
        <div
          className="w-72 p-3"
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <h2 className="text-center font-bold text-xl">Notifications</h2>
          <p>Here are your notifications...</p>
        </div>
      </Drawer>
    </>
  );
};

export default NotificationDrawer;
