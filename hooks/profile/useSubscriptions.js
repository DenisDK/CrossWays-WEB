import { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

const useSubscriptions = (user) => {
  const [travelCompanions, setTravelCompanions] = useState([]);

  useEffect(() => {
    if (user) {
      const fetchTravelCompanions = async () => {
        try {
          const userDocRef = doc(db, "Users", user.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists() && userDoc.data().travelCompanions) {
            const companionUIDs = userDoc.data().travelCompanions;
            const companionDataPromises = companionUIDs.map(async (uid) => {
              const companionDoc = await getDoc(doc(db, "Users", uid));
              return { uid, ...companionDoc.data() };
            });

            const companions = await Promise.all(companionDataPromises);
            setTravelCompanions(companions);
          }
        } catch (error) {
          console.error("Failed to fetch travel companions:", error);
        }
      };

      fetchTravelCompanions();
    }
  }, [user]);

  const handleRemoveCompanion = async (companionUID) => {
    try {
      const updatedCompanions = travelCompanions.filter(
        (comp) => comp.uid !== companionUID
      );
      setTravelCompanions(updatedCompanions);

      const userDocRef = doc(db, "Users", user.uid);
      await setDoc(
        userDocRef,
        { travelCompanions: updatedCompanions.map((comp) => comp.uid) },
        { merge: true }
      );
    } catch (error) {
      console.error("Failed to remove companion:", error);
    }
  };

  return { travelCompanions, handleRemoveCompanion };
};

export default useSubscriptions;
