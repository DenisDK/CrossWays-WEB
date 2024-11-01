import { Avatar } from "@mui/material";
import React from "react";

const FlagIcon = ({ countryCode }) => {
  return (
    <Avatar
      alt={countryCode}
      src={`https://flagcdn.com/w20/${countryCode}.png`}
      sx={{ width: 24, height: 24, marginRight: 1 }}
    />
  );
};

export default FlagIcon;
