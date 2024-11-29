import React from "react";
import { Drawer, Badge, Button, Avatar, Typography } from "@mui/material";
import { FaBell } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { FaCheck } from "react-icons/fa";
const NotificationDrawer = ({
  isDrawerOpen,
  toggleDrawer,
  requests,
  trips,
  handleAcceptRequest,
  handleRejectRequest,
}) => {
  return (
    <>
      <Badge
        className="cursor-pointer ml-2"
        badgeContent={requests.length}
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
          <h2 className="text-center font-bold text-xl mb-5">Notifications</h2>
          {requests.map((request) => {
            const trip = trips.find((trip) => trip.id === request.tripId);
            return (
              <div
                key={request.userId}
                className="mb-4 flex items-center justify-between"
              >
                <div className="flex items-center">
                  <Avatar src={request.userAvatar} alt={request.userName} />
                  <div className="ml-2">
                    <Typography variant="body1">{request.userName}</Typography>
                    <Typography variant="body2">{trip.title}</Typography>
                  </div>
                </div>
                <div className="flex justify-end mt-2">
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleAcceptRequest(trip.id, request.userId)}
                  >
                    <FaCheck />
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleRejectRequest(trip.id, request.userId)}
                    className="ml-2"
                  >
                    <IoMdClose size={18} />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </Drawer>
    </>
  );
};

export default NotificationDrawer;
