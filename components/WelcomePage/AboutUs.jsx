import Image from "next/image";
import React from "react";
import { useTranslations } from "next-intl";

const AboutUs = () => {
  const t = useTranslations("WelcomePage");
  return (
    <div className="max-w-screen-xl mx-auto mt-24 flex justify-between items-center">
      <div className="">
        <div className="text-[#876447] font-bold text-6xl">
          {/* About us */}
          {t("aboutTitle")}
        </div>
        <p className="text-[#876447] max-w-xl mt-24 text-3xl">
          {/* &quot;CrossWays&quot; is an international platform created to help
          people struggling with finding company for their trips or feeling
          desire to improve its planning. Developed by the group of particulary
          stubborn students, &quot;CrossWays&quot; has to offer you a lot of
          useful tools for satisfying work and travel planning. Keep reading to
          know more. */}
          {t("about")}
        </p>
      </div>
      <div className=" relative">
        <Image
          src="/about-us-img-component.png"
          alt="about us component img"
          width={500}
          height={500}
        />
        <div className="absolute inset-0 bg-[#8B6857] opacity-30 z-0 rounded-[30px]"></div>
      </div>
    </div>
  );
};

export default AboutUs;
