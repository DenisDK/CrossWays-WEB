import { Link } from "@/i18n/routing";
import { Button } from "@mui/material";
import React from "react";

const Nav = () => {
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
              About
            </Button>
          </li>
        </Link>
        <li>
          <Button
            className="text-[#876447] font-bold hover:bg-opacity-10 hover:bg-[#876447]"
            variant="text"
          >
            Explore
          </Button>
        </li>
        <li>
          <Button
            className="text-[#876447] font-bold hover:bg-opacity-10 hover:bg-[#876447]"
            variant="text"
          >
            FAQ
          </Button>
        </li>
        <Link href="/Users">
          <li>
            <Button
              className="text-[#876447] font-bold hover:bg-opacity-10 hover:bg-[#876447]"
              variant="text"
            >
              Search
            </Button>
          </li>
        </Link>
      </ul>
    </nav>
  );
};

export default Nav;
