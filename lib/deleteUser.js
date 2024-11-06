import { getAuth, deleteUser } from "firebase/auth";
import {
  getFirestore,
  doc,
  collection,
  query,
  where,
  getDocs,
  writeBatch,
} from "firebase/firestore";

export const deleteUserAndData = async () => {
  const auth = getAuth();
  const db = getFirestore();
  const user = auth.currentUser;

  if (!user) {
    console.log("No user is currently logged in.");
    return;
  }

  try {
    const batch = writeBatch(db);

    // User document reference
    const userDocRef = doc(db, "Users", user.uid);
    batch.delete(userDocRef);

    // FeedbackComment documents deletion
    const feedbackCommentQuery = query(
      collection(db, "FeedbackComment"),
      where("userId", "==", user.uid)
    );
    const feedbackCommentSnapshot = await getDocs(feedbackCommentQuery);
    feedbackCommentSnapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });

    // FeedbackStars documents deletion
    const feedbackStarsQuery = query(
      collection(db, "FeedbackStars"),
      where("userId", "==", user.uid)
    );
    const feedbackStarsSnapshot = await getDocs(feedbackStarsQuery);
    feedbackStarsSnapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });

    // Commit batch
    await batch.commit();
    console.log("Firestore documents deleted successfully");

    // Delete user from Firebase Authentication
    await deleteUser(user);
    console.log("User deleted from Firebase Auth");

    return { success: true };
  } catch (error) {
    console.error("Error deleting user and data:", error);
    return { success: false, error };
  }
};
