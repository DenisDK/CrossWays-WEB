import Image from "next/image";
import React from "react";
import { useTranslations } from "next-intl";

const TitleImg = () => {
  const t = useTranslations("WelcomePage");
  return (
    <div className="max-w-screen-xl mx-auto relative mt-12">
      <Image
        className="w-full h-full"
        src="/photo.png"
        alt="Main photo"
        width={700}
        height={700}
      />
      <div className="absolute inset-0 bg-[#8B6857] opacity-30 z-0 rounded-[30px]"></div>
      <h1 className="absolute top-[300px] left-[450px]  text-7xl transform -translate-x-1/2 -translate-y-1/2 z-10 text-white font-bold px-4">
        <span className="block ">
          {/* Find your travel */}
          {t("titleSpan")}
        </span>
        {/* soulmate fast & easily */}
        {t("title")}
      </h1>
      <h3 className="absolute top-[365px] left-[360px] transform -translate-x-1/2 -translate-y-1/2 mt-10 z-10 text-white px-4 text-3xl">
        {/* Cross ways and explore the world together */}
        {t("catchphrase")}
      </h3>
    </div>
  );
};

export default TitleImg;
