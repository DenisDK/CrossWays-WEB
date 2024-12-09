import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

const useAverageRating = (user) => {
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    if (user) {
      const fetchAverageRating = async () => {
        try {
          const starsRef = collection(db, "Users", user.uid, "FeedbackStars");
          const querySnapshot = await getDocs(starsRef);
          const starsData = querySnapshot.docs.map((doc) => doc.data().stars);
          const totalStars = starsData.reduce((acc, stars) => acc + stars, 0);
          const count = starsData.length;
          const average = count > 0 ? totalStars / count : 0;

          setAverageRating(average);
        } catch (error) {
          console.error("Failed to fetch average rating:", error);
        }
      };

      fetchAverageRating();
    }
  }, [user]);

  return { averageRating };
};

export default useAverageRating;
