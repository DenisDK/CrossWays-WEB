import React from "react";
import { FaFeatherAlt } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";
import { FaCircleQuestion } from "react-icons/fa6";
import { LuRepeat2 } from "react-icons/lu";
import SeparatorContentItem from "./SeparatorContentItem";
import { useTranslations } from "next-intl";

const SeparatorContent = () => {
  const t = useTranslations("SeparatorContent");
  return (
    <div className="max-w-screen-xl mx-auto">
      <h2 className="text-6xl text-[#876447]">
        {/* Top opportunities for you */}
        {t("title")}
      </h2>
      <div className="flex justify-between mt-24">
        <SeparatorContentItem
          icon={<FaFeatherAlt size={25} />}
          // title={"Choose your dream trip"}
          title={t("tripTitle")}
          // text={'We will help you with the "boring" staff!'}
          text={t("tripParagraph")}
        />
        <SeparatorContentItem
          icon={<FaHeart size={25} />}
          // title={"Finding friends"}
          title={t("friendsTitle")}
          // text={"Meet people to travel together!"}
          text={t("friendsParagraph")}
        />
        <SeparatorContentItem
          icon={<LuRepeat2 size={25} />}
          // title={"Travel matching"}
          title={t("matchingTitle")}
          // text={"Filter travels and people by our special tool!"}
          text={t("matchingParagraph")}
        />
        <SeparatorContentItem
          icon={<FaCircleQuestion size={25} />}
          // title={"Free travel advice"}
          title={t("adviceTitle")}
          // text={"We will always help you out!"}
          text={t("adviceParagraph")}
        />
      </div>
    </div>
  );
};

export default SeparatorContent;
