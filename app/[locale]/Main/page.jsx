// "use client";
// import Header from "@/components/Header/Header";
// import { Button } from "@mui/material";
// import Image from "next/image";
// import React, { useState } from "react";
// import { useTranslations } from "next-intl";
// import { Link } from "@/i18n/routing";

// // firebase
// import { auth } from "@/lib/firebase";

// const MainPage = () => {
//   const t = useTranslations("MainPage");
//   const [isUser, setIsUser] = useState(auth.currentUser);
//   return (
//     <div>
//       <Header />
//       <div className="max-w-screen-xl mx-auto relative mt-12">
//         <Image
//           className="w-full h-full"
//           src="/photo.png"
//           alt="Main photo"
//           width={700}
//           height={700}
//         />
//         <div className="absolute inset-0 bg-[#8B6857] opacity-30 z-0 rounded-[30px]"></div>
//         <h2 className="absolute top-[300px] left-[350px]  text-7xl transform -translate-x-1/2 -translate-y-1/2 z-10 text-white font-bold px-4">
//           {/* Welcome back! */}
//           {t("title")}
//         </h2>
//         {isUser ? (
//           <Link href={"/"}>
//             <Button
//               variant="contained"
//               className="absolute top-[400px] left-[180px] bg-white text-[#876447] transform -translate-x-1/2 -translate-y-1/2 z-10 font-bold"
//             >
//               {/* Create a new trip */}
//               {t("createTripButton")}
//             </Button>
//           </Link>
//         ) : (
//           <Link href={"/Join-Now"}>
//             <Button
//               variant="contained"
//               className="absolute top-[400px] left-[180px] bg-white text-[#876447] transform -translate-x-1/2 -translate-y-1/2 z-10 font-bold"
//             >
//               {/* Create a new trip */}
//               {t("createTripButton")}
//             </Button>
//           </Link>
//         )}
//       </div>
//     </div>
//   );
// };

// export default MainPage;

"use client";
import Header from "@/components/Header/Header";
import { Button, CircularProgress } from "@mui/material";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

// Firebase
import { auth } from "@/lib/firebase";

const MainPage = () => {
  const t = useTranslations("MainPage");
  const [isUser, setIsUser] = useState(auth.currentUser);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading (e.g., for fetching user data or translations)
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000); // Adjust the duration as needed

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="max-w-screen-xl mx-auto relative mt-12">
        <Image
          className="w-full h-full"
          src="/photo.png"
          alt="Main photo"
          width={700}
          height={700}
        />
        <div className="absolute inset-0 bg-[#8B6857] opacity-30 z-0 rounded-[30px]"></div>
        <h2 className="absolute top-[300px] left-[350px] text-7xl transform -translate-x-1/2 -translate-y-1/2 z-10 text-white font-bold px-4">
          {t("title")}
        </h2>
        {isUser ? (
          <>
            <Link href={"/MyTrips"}>
              <Button
                variant="contained"
                className="absolute w-[200px] top-[400px] left-[180px] bg-white text-[#876447] transform -translate-x-1/2 -translate-y-1/2 z-10 font-bold"
              >
                {t("createTripButton")}
              </Button>
            </Link>
            <Link href={"/OtherTrips"}>
              <Button
                variant="contained"
                className="absolute w-[200px] top-[450px] left-[180px] bg-white text-[#876447] transform -translate-x-1/2 -translate-y-1/2 z-10 font-bold"
              >
                {t("findNewTripButton")}
              </Button>
            </Link>
          </>
        ) : (
          <Link href={"/Join-Now"}>
            <Button
              variant="contained"
              className="absolute top-[400px] left-[180px] bg-white text-[#876447] transform -translate-x-1/2 -translate-y-1/2 z-10 font-bold"
            >
              {t("createTripButton")}
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default MainPage;
