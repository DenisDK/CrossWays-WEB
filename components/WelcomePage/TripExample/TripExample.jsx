import React from "react";
import TripExampleItem from "./TripExampleItem";
import { Button } from "@mui/material";
// import Link from "next/link";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

const TripExample = () => {
  const t = useTranslations("TripExamples");
  return (
    <div className="max-w-screen-xl mx-auto">
      <h1 className="text-[#876447] text-6xl font-bold mt-28">
        {/* Choose your dream trip */}
        {t("title")}
      </h1>
      <div className="flex justify-between mt-24">
        <TripExampleItem
          img={"/Franse-Trip-Examle.png"}
          alt={"Franse-Trip-Examle"}
          defaultValue={4}
          precision={0.5}
          // title={"Paris weekend"}
          title={t("firstTripTitleExample")}
          price={"50$" + t("tripPriceExample")}
        />
        <TripExampleItem
          img={"/Kharkiv-Trip-Example.png"}
          alt={"Kharkiv-Trip-Example"}
          defaultValue={5}
          precision={0.5}
          // title={"Month in Kharkiv"}
          title={t("secondTripTitleExample")}
          price={"1$" + t("tripPriceExample")}
        />
        <TripExampleItem
          img={"/Kharkiv-Trip-Example.png"}
          alt={"Kharkiv-Trip-Example"}
          defaultValue={4.5}
          precision={0.5}
          // title={"Month in Kharkiv"}
          title={t("thirdTripTitleExample")}
          price={"1$" + t("tripPriceExample")}
        />
      </div>
      <div className="text-center">
        <Link href={"/Join-Now"}>
          <Button className="bg-[#5C6D67] mt-20 text-lg" variant="contained">
            {/* Sign up to see more */}
            {t("signUpButton")}
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default TripExample;
