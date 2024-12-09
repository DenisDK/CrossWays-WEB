import React from "react";
import Avatar from "@mui/material/Avatar";
import Rating from "@mui/material/Rating";
import Button from "@mui/material/Button";
import { GiLaurelCrown } from "react-icons/gi";
import { useTranslations } from "next-intl";
import calculateAge from "@/hooks/otherUserProfilePage/calculateAge";

const ProfileHeader = ({
  profileData,
  isFollowing,
  handleFollowToggle,
  rating,
  handleRatingChange,
}) => {
  const t = useTranslations("Profile");

  return (
    <div className="flex justify-between max-w-screen-lg">
      <div className="flex flex-col items-center min-w-[300px] bg-[#e9b08254] rounded-xl p-5">
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
        <Rating
          className="mt-2"
          name="user-rating"
          value={rating}
          onChange={handleRatingChange}
        />

        {isFollowing ? (
          <Button
            className="mt-5 w-40"
            variant="contained"
            color="error"
            onClick={handleFollowToggle}
          >
            {t("otherUserUnFollowButton")}
          </Button>
        ) : (
          <Button
            className="mt-5 w-40"
            variant="contained"
            onClick={handleFollowToggle}
          >
            {t("otherUserFollowButton")}
          </Button>
        )}
      </div>

      <div className="flex flex-col flex-grow gap-6 pl-6">
        <div className="bg-[#e9b08254] p-5 rounded-xl w-[700px]">
          <span className="font-bold text-2xl mr-3">{t("userAboutMe")}:</span>
          <span className="text-xl">{profileData?.aboutMe || "N/A"}</span>
        </div>
        <div className="bg-[#e9b08254] p-5 h-full flex flex-col gap-6 rounded-xl">
          <div>
            <span className="font-bold text-2xl mr-3">{t("userGender")}:</span>
            <span className="text-xl">{profileData?.gender || "N/A"}</span>
          </div>
          <div>
            <span className="font-bold text-2xl mr-3">
              {t("userDateOfBirth")}:
            </span>
            <span className="text-xl">
              {profileData?.birthday?.toDate().toLocaleDateString() || "N/A"}
            </span>
          </div>
          <div>
            <span className="font-bold text-2xl mr-3">
              {t("otherUserAge")}:
            </span>
            <span className="text-xl">
              {profileData?.birthday
                ? calculateAge(profileData.birthday)
                : "N/A"}
            </span>
          </div>
          <div>
            <span className="font-bold text-2xl mr-3">
              {t("otherUserPrivacy")}:
            </span>
            <span className="text-xl">
              {profileData?.isPrivate
                ? t("otherUserPrivacyPrivate")
                : t("otherUserPrivacyPublic")}
            </span>
          </div>
          <div className="flex items-center">
            <span className="font-bold text-2xl mr-3">
              {t("otherUserVipStatus")}:
            </span>
            <span className="text-xl flex">
              {profileData?.isPremium ? (
                <span className="flex items-center">
                  <span className="mr-2">{t("otherUserHasVip")}</span>
                  <GiLaurelCrown size={40} color="orange" />
                </span>
              ) : (
                t("otherUserNoVip")
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
