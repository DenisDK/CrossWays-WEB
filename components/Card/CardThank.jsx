import React from "react";
import { GiLaurelCrown } from "react-icons/gi";
const CardThank = () => {
  return (
    <div className="border-[3px] rounded-[30px] border-[#876447] p-10 mt-16 mx-auto max-w-xl">
      <div className="text-center">
        <h2 className="text-[#876447] text-3xl font-bold">Thank you!</h2>
        <h3 className="text-[#876447] text-2xl mt-3">
          You have purchased premium status, now you have access to all the
          capabilities of the service
        </h3>
      </div>
      <div className="flex flex-col items-center mt-10">
        <GiLaurelCrown size={150} color="orange" />
      </div>
    </div>
  );
};

export default CardThank;
