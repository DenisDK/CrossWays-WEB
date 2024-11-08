import CardPremium from "@/components/Card/CardPremium";
import CardStandard from "@/components/Card/CardStandard";
import Header from "@/components/Header/Header";
import React from "react";

const PremiumPage = () => {
  return (
    <>
      <Header />
      <div className="max-w-screen-lg mx-auto mt-32">
        <h2 className="text-[#876447] text-6xl font-bold">Available plans</h2>
        <h3 className="text-[#876447] text-3xl mt-3">
          There are several plans for using CrossWays. Please choose the one
          that suits you best.
        </h3>
      </div>
      <div className="flex justify-between max-w-screen-lg mx-auto">
        <CardStandard />
        <CardPremium />
      </div>
    </>
  );
};

export default PremiumPage;
