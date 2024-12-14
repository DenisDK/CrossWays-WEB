import { Link } from "@/i18n/routing";
import { Button } from "@mui/material";
import { useTranslations } from "next-intl";
import React from "react";

const Nav = () => {
  const t = useTranslations("Navigation");
  return (
    // flex-1 max-w-96
    <nav className="px-3">
      <ul className="flex justify-between">
        <Link href="/">
          <li>
            <Button
              className="text-[#876447] font-bold hover:bg-opacity-10 hover:bg-[#876447]"
              variant="text"
            >
              {t("navigateAboutUs")}
            </Button>
          </li>
        </Link>
        <Link href="/MyTrips">
          <li>
            <Button
              className="text-[#876447] font-bold hover:bg-opacity-10 hover:bg-[#876447]"
              variant="text"
            >
              {t("navigateMyTrips")}
            </Button>
          </li>
        </Link>
        <Link href="/OtherTrips">
          <li>
            <Button
              className="text-[#876447] font-bold hover:bg-opacity-10 hover:bg-[#876447]"
              variant="text"
            >
              {t("navigateFindTrips")}
            </Button>
          </li>
        </Link>
        <Link href="/Users">
          <li>
            <Button
              className="text-[#876447] font-bold hover:bg-opacity-10 hover:bg-[#876447]"
              variant="text"
            >
              {t("navigateSearch")}
            </Button>
          </li>
        </Link>
      </ul>
    </nav>
  );
};

export default Nav;
