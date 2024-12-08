import { useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

const useAuth = () => {
  const [currentUserId, setCurrentUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUserId(user.uid);
      } else {
        console.log("Пользователь не авторизован");
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return { currentUserId, loading, setLoading };
};

export default useAuth;
