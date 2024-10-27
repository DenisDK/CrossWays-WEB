import { Button } from "@mui/material";
import React from "react";

const AuthButton = ({ providerName, providerIcon, signInWithProvider }) => {
  return (
    <div>
      <Button
        variant="outlined"
        className="text-[#876447] border-[#876447] hover:bg-opacity-10 hover:bg-[#876447] min-w-72 mt-3"
        onClick={signInWithProvider}
      >
        {providerIcon} <span className="px-1">continue with</span>{" "}
        {providerName}
      </Button>
    </div>
  );
};

export default AuthButton;
