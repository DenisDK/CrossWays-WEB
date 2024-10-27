import React from "react";
import { FaFeatherAlt } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";
import { FaCircleQuestion } from "react-icons/fa6";
import { LuRepeat2 } from "react-icons/lu";
import SeparatorContentItem from "./SeparatorContentItem";

const SeparatorContent = () => {
  return (
    <div className="max-w-screen-xl mx-auto">
      <h2 className="text-6xl text-[#876447]">Top opportunities for you</h2>
      <div className="flex justify-between mt-24">
        <SeparatorContentItem
          icon={<FaFeatherAlt size={25} />}
          title={"Choose your dream trip"}
          text={'We will help you with the "boring" staff!'}
        />
        <SeparatorContentItem
          icon={<FaHeart size={25} />}
          title={"Finding friends"}
          text={"Meet people to travel together!"}
        />
        <SeparatorContentItem
          icon={<LuRepeat2 size={25} />}
          title={"Travel matching"}
          text={"Filter travels and people by our special tool!"}
        />
        <SeparatorContentItem
          icon={<FaCircleQuestion size={25} />}
          title={"Free travel advice"}
          text={"We will always help you out!"}
        />
      </div>
    </div>
  );
};

export default SeparatorContent;
