import React from "react";

function SeparatorContentItem({ icon, title, text }) {
  return (
    <div className="max-w-screen-xl mx-auto flex flex-col items-center">
      <div className="bg-[#5C6D67] w-[70px] h-[70px] rounded-full relative">
        <div className="transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 absolute text-white">
          {icon}
        </div>
      </div>
      <h2 className="text-center text-[#876447] text-2xl font-bold mt-3 mb-5">
        {title}
      </h2>
      <p className="text-center text-[#876447] text-2xl">{text}</p>
    </div>
  );
}

export default SeparatorContentItem;
