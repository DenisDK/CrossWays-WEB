import { useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase";
import {
  doc,
  getDoc,
  query,
  collection,
  where,
  onSnapshot,
} from "firebase/firestore";

const useProfileData = (id) => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!id) return;
      const userDoc = doc(db, "Users", id);
      const userSnapshot = await getDoc(userDoc);

      if (userSnapshot.exists()) {
        setProfileData(userSnapshot.data());
      }

      const currentUser = auth.currentUser;
      if (!currentUser) {
        console.error("User not logged in");
        setLoading(false);
        return;
      }

      const currentUserDoc = doc(db, "Users", currentUser.uid);
      const currentUserSnapshot = await getDoc(currentUserDoc);

      if (
        currentUserSnapshot.exists() &&
        currentUserSnapshot.data().travelCompanions?.includes(id)
      ) {
        setIsFollowing(true);
      }

      setLoading(false);
    };

    fetchProfileData();
  }, [id]);

  useEffect(() => {
    if (!id) return;

    const q = query(
      collection(db, "Users", id, "FeedbackComment"),
      where("createdAt", "!=", null)
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const commentsData = [];
      querySnapshot.forEach((doc) => {
        commentsData.push({ ...doc.data(), id: doc.id });
      });
      setComments(commentsData);
    });

    return () => unsubscribe();
  }, [id]);

  return {
    profileData,
    loading,
    isFollowing,
    setIsFollowing,
    comments,
    setComments,
  };
};

export default useProfileData;
