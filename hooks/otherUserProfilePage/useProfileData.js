import { useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase";
import {
  doc,
  getDoc,
  query,
  collection,
  where,
  onSnapshot,
  addDoc,
  setDoc,
  getDocs,
} from "firebase/firestore";

const useProfileData = (id) => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [comments, setComments] = useState([]);
  const [rating, setRating] = useState(0);

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

      // Fetch user rating
      const q = query(
        collection(db, "Users", id, "FeedbackStars"),
        where("userID", "==", currentUser.uid)
      );
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        setRating(querySnapshot.docs[0].data().stars);
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

  const handleRatingChange = async (event, newValue) => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      console.error("User not logged in");
      return;
    }

    try {
      const q = query(
        collection(db, "Users", id, "FeedbackStars"),
        where("userID", "==", currentUser.uid)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const ratingDoc = querySnapshot.docs[0].ref;
        await setDoc(ratingDoc, { stars: newValue, userID: currentUser.uid });
      } else {
        await addDoc(collection(db, "Users", id, "FeedbackStars"), {
          stars: newValue,
          userID: currentUser.uid,
        });
      }

      setRating(newValue);
    } catch (error) {
      console.error("Error updating rating: ", error);
    }
  };

  return {
    profileData,
    loading,
    isFollowing,
    setIsFollowing,
    comments,
    setComments,
    rating,
    handleRatingChange,
  };
};

export default useProfileData;
