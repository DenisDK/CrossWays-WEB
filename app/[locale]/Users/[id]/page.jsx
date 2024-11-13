"use client";

import Header from "@/components/Header/Header";
import React, { useEffect, useState } from "react";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Rating from "@mui/material/Rating";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useParams } from "next/navigation";
import { CircularProgress } from "@mui/material";
import { GiLaurelCrown } from "react-icons/gi";

const OtherUserProfilePage = () => {
  const { id } = useParams();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const fetchProfileData = async () => {
        const userDoc = doc(db, "Users", id);
        const userSnapshot = await getDoc(userDoc);
        if (userSnapshot.exists()) {
          setProfileData(userSnapshot.data());
        }
        setLoading(false);
      };
      fetchProfileData();
    }
  }, [id]);

  const calculateAge = (birthday) => {
    const birthDate = birthday.toDate();
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  if (loading)
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        <CircularProgress />
      </div>
    );

  return (
    <div>
      <Header />
      <div className="flex flex-col items-center justify-center mt-48">
        <div className="flex justify-between max-w-screen-lg">
          <div className="flex flex-col items-center min-w-[300px] bg-[#e9b08254] rounded-xl pt-5">
            <Avatar
              className="mb-4"
              alt={profileData?.name}
              src={profileData?.profileImage || "/noavatar.png"}
              sx={{ width: 200, height: 200 }}
            />
            <div className="text-2xl font-bold">
              {profileData?.name || "User Name"}
            </div>
            <div className="text-xl font-bold">
              {profileData?.nickname || "Nickname"}
            </div>
            <Rating className="mt-2" name="read-only" value={5} readOnly />
          </div>

          <div className="flex flex-col flex-grow gap-6 pl-6">
            <div className="bg-[#e9b08254] p-5 rounded-xl w-[700px]">
              <span className="font-bold text-2xl mr-3">About Me:</span>
              <span className="text-xl">{profileData?.aboutMe || "N/A"}</span>
            </div>
            <div className="bg-[#e9b08254] p-5 flex flex-col gap-6 rounded-xl">
              <div>
                <span className="font-bold text-2xl mr-3">Gender:</span>
                <span className="text-xl">{profileData?.gender || "N/A"}</span>
              </div>
              <div>
                <span className="font-bold text-2xl mr-3">Date of Birth:</span>
                <span className="text-xl">
                  {profileData?.birthday?.toDate().toLocaleDateString() ||
                    "N/A"}{" "}
                  /{" "}
                  {profileData?.birthday
                    ? calculateAge(profileData.birthday)
                    : "N/A"}
                </span>
              </div>
              <div>
                <span className="font-bold text-2xl mr-3">
                  Account Privacy:
                </span>
                <span className="text-xl">
                  {profileData?.isPrivate ? "Private" : "Public"}
                </span>
              </div>
              <div className="flex items-center">
                <span className="font-bold text-2xl mr-3">VIP Status:</span>
                <span className="text-xl flex">
                  {profileData?.isPremium ? (
                    <span className="flex items-center">
                      <span className="mr-2">Yes</span>
                      <GiLaurelCrown size={40} color="orange" />
                    </span>
                  ) : (
                    "No"
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtherUserProfilePage;
