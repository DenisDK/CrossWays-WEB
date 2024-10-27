import { Rating } from "@mui/material";
import Image from "next/image";
import React from "react";

const TripExampleItem = ({
  img,
  alt,
  defaultValue,
  precision,
  title,
  price,
}) => {
  return (
    <div className="">
      <div className="relative">
        <Image src={img} alt={alt} width={340} height={240} />
        <Rating
          className="absolute bottom-2 right-2"
          name="half-rating-read"
          defaultValue={defaultValue}
          precision={precision}
          readOnly
        />
      </div>
      <div className="bg-white shadow-lg shadow-black-500/50 rounded-b-3xl py-7 max-w-80 mx-auto">
        <h3 className="text-[#876447] text-center text-2xl">{title}</h3>
        <p className="text-[#876447] text-center text-2xl font-bold">{price}</p>
      </div>
    </div>
  );
};

export default TripExampleItem;
