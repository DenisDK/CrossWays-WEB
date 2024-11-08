import React from "react";
import { FaCheck } from "react-icons/fa6";

const CardPremium = () => {
  return (
    <div className="border-[3px] rounded-3xl border-[#5C6D67] p-10 mt-16 max-w-xl">
      <div className="text-center max-w-96">
        <h2 className="text-[#876447] text-3xl font-bold">Advanced</h2>
        <h3 className="text-[#876447] text-2xl mt-3">
          Use advanced functionality for a better user experience
        </h3>
      </div>
      <div className="flex flex-col items-center my-10">
        <p className="flex items-center text-2xl text-[#876447]">
          <span className="mr-2">
            <FaCheck color="#19a625" />
          </span>
          Lorem, ipsum dolor.
        </p>
        <p className="flex items-center text-2xl text-[#876447]">
          <span className="mr-2">
            <FaCheck color="#19a625" />
          </span>
          Lorem, ipsum dolor.
        </p>
        <p className="flex items-center text-2xl text-[#876447]">
          <span className="mr-2">
            <FaCheck color="#19a625" />
          </span>
          Lorem, ipsum dolor.
        </p>
        <p className="flex items-center text-2xl text-[#876447]">
          <span className="mr-2">
            <FaCheck color="#19a625" />
          </span>
          Lorem, ipsum dolor.
        </p>
        <p className="flex items-center text-2xl text-[#876447]">
          <span className="mr-2">
            <FaCheck color="#19a625" />
          </span>
          Lorem, ipsum dolor.
        </p>
      </div>
      <div className="text-center">
        <span className="text-white text-2xl bg-[#5C6D67] px-5 py-2 rounded-lg">
          Now active
        </span>
      </div>
    </div>
  );
};

export default CardPremium;
