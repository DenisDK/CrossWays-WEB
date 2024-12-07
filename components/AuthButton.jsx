import { Button } from "@mui/material";
import React from "react";
import { useTranslations } from "next-intl";

const AuthButton = ({ providerName, providerIcon, signInWithProvider }) => {
  const t = useTranslations("Authentication");
  return (
    <div>
      <Button
        variant="outlined"
        className="text-[#876447] border-[#876447] hover:bg-opacity-10 hover:bg-[#876447] min-w-72 mt-3"
        onClick={signInWithProvider}
      >
        {providerIcon} <span className="px-1">{t("authButton")}</span>
        {providerName}
      </Button>
    </div>
  );
};

export default AuthButton;
