import { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

const useComments = (user) => {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    if (user) {
      const fetchComments = async () => {
        try {
          const commentsRef = collection(
            db,
            "Users",
            user.uid,
            "FeedbackComment"
          );
          const q = query(commentsRef, where("createdAt", "!=", null));
          const querySnapshot = await getDocs(q);
          const commentsData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setComments(commentsData);
        } catch (error) {
          console.error("Failed to fetch comments:", error);
        }
      };

      fetchComments();
    }
  }, [user]);

  return { comments };
};

export default useComments;
