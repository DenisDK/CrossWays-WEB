"use client";

import { Button } from "@mui/material";
// import Link from "next/link";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

import React from "react";
import AuthButton from "@/components/AuthButton";
import { useRouter } from "next/navigation";

// Icons
import { FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { IoMdLock } from "react-icons/io";

// firebase
import { signInWithGoogle } from "@/lib/signIn";
import { signInWithFacebook } from "@/lib/signIn";

const JoinNow = () => {
  const t = useTranslations("Authentication");
  const router = useRouter();
  const handleGoogleSignIn = () => signInWithGoogle(router);
  const handleFacebookSignIn = () => signInWithFacebook(router);

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
          {t("authTitle")}
        </h2>
        <p className="text-[#876447] text-center">{t("authParagraph")}</p>
        <AuthButton
          providerName={"Google"}
          providerIcon={<FcGoogle size={20} />}
          signInWithProvider={handleGoogleSignIn}
        />
        <AuthButton
          providerName={"Facebook"}
          providerIcon={<FaFacebook className="text-cyan-700" size={20} />}
          signInWithProvider={handleFacebookSignIn}
        />
        <div className="text-right">
          <Link href={"/"}>
            <Button
              className="text-[#876447] font-bold hover:bg-opacity-10 hover:bg-[#876447] mt-3"
              variant="text"
            >
              {t("homeButton")}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default JoinNow;
