"use client";
import Header from "@/components/Header/Header";
import { Button } from "@mui/material";
import Image from "next/image";
import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

// firebase
import { auth } from "@/lib/firebase";

const MainPage = () => {
  const [isUser, setIsUser] = useState(auth.currentUser);
  return (
    <div>
      <Header />
      <div className="max-w-screen-xl mx-auto relative mt-12">
        <Image
          className="w-full h-full"
          src="/photo.png"
          alt="Main photo"
          width={700}
          height={700}
        />
        <div className="absolute inset-0 bg-[#8B6857] opacity-30 z-0 rounded-[30px]"></div>
        <h2 className="absolute top-[300px] left-[350px]  text-7xl transform -translate-x-1/2 -translate-y-1/2 z-10 text-white font-bold px-4">
          Welcome back!
        </h2>
        {isUser ? (
          <Link href={"/"}>
            <Button
              variant="contained"
              className="absolute top-[400px] left-[180px] bg-white text-[#876447] transform -translate-x-1/2 -translate-y-1/2 z-10 font-bold"
            >
              Create a new trip
            </Button>
          </Link>
        ) : (
          <Link href={"/Join-Now"}>
            <Button
              variant="contained"
              className="absolute top-[400px] left-[180px] bg-white text-[#876447] transform -translate-x-1/2 -translate-y-1/2 z-10 font-bold"
            >
              Create a new trip
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default MainPage;
