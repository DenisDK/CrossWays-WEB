import React from "react";
import { useTranslations } from "next-intl";
import { GiLaurelCrown } from "react-icons/gi";
const CardThank = () => {
  const t = useTranslations("Card");
  return (
    <div className="border-[3px] rounded-[30px] border-[#876447] p-10 mt-16 mx-auto max-w-xl">
      <div className="text-center">
        <h2 className="text-[#876447] text-3xl font-bold">
          {t("cardThankTitle")}
        </h2>
        <h3 className="text-[#876447] text-2xl mt-3">
          {t("cardThankParagraph")}
        </h3>
      </div>
      <div className="flex flex-col items-center mt-10">
        <GiLaurelCrown size={150} color="orange" />
      </div>
    </div>
  );
};

export default CardThank;
