import AuthButton from "@/components/AuthButton";
import { Button } from "@mui/material";
import Link from "next/link";
import React from "react";

// Icons
import { FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { IoMdLock } from "react-icons/io";

const LogUp = () => {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen">
      <div className="">
        <div className="w-12 h-12 rounded-full bg-[#876447] relative shadow-xl mx-auto">
          <IoMdLock
            size={28}
            className="text-white absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
          />
        </div>
        <h2 className="text-[#876447] text-center text-3xl font-bold py-3">
          Sign Up
        </h2>
        <p className="text-[#876447] text-center">
          Welcome, please sign up to continue
        </p>
        <AuthButton
          providerName={"Google"}
          providerIcon={<FcGoogle size={20} />}
          text={"Sign Up"}
        />
        <AuthButton
          providerName={"Facebook"}
          providerIcon={<FaFacebook className="text-cyan-700" size={20} />}
          text={"Sign Up"}
        />
        <div className="flex justify-between items-center">
          <Link href={"/"}>
            <Button
              className="text-[#876447] font-bold  hover:bg-opacity-10 hover:bg-[#876447] mt-3"
              variant="text"
            >
              Home
            </Button>
          </Link>
          <Link href={"/Sign-In"}>
            <Button
              className="text-[#876447] font-bold  hover:bg-opacity-10 hover:bg-[#876447] mt-3"
              variant="text"
            >
              Sign In
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LogUp;
