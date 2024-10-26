import { Button } from "@mui/material";
import React from "react";
import Nav from "./Nav";
import Image from "next/image";
import Link from "next/link";

const Header = () => {
  return (
    <div className="max-w-screen-xl mx-auto flex justify-between items-center my-5 px-2">
      <div className="text-[#876447] font-bold text-4xl flex">
        CrossWays
        <Image
          src="/airplanw-ico.svg"
          alt="Airplane icon"
          width={30}
          height={30}
        />
      </div>
      <Nav />
      <div className="">
        <Link href={"/Sign-In"}>
          <Button
            className="mr-5 text-[#5C6D67] bg-transparent rounded-2xl"
            variant="contained"
          >
            Sign in
          </Button>
        </Link>
        <Link href={"/Sign-Up"}>
          <Button className="bg-[#5C6D67] rounded-2xl" variant="contained">
            Sign Up
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Header;
