import { Avatar } from "@mui/material";
import React, { useEffect, useState } from "react";

// firebase
import { auth } from "@/lib/firebase"; // імпортуйте ваш конфіг для Firebase
import { onAuthStateChanged } from "firebase/auth";

const ProfileInfo = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        // Користувач увійшов
        setUser({
          displayName: currentUser.displayName,
          photoURL: currentUser.photoURL,
        });
      } else {
        // Користувач не увійшов
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="flex items-center">
      {user ? (
        <>
          {user.photoURL && (
            <Avatar
              alt={user.displayName}
              src={user.photoURL || "/noavatar.png"}
            />
          )}
          <span className="ml-2 text-[#876447] font-medium">
            {user.displayName || "User"}
          </span>
        </>
      ) : (
        <>
          <Avatar alt="Гість" />
          <span className="text-[#876447]">Гість</span>
        </>
      )}
    </div>
  );
};

export default ProfileInfo;
