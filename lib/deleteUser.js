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

    // Reference to the user's main document
    const userDocRef = doc(db, "Users", user.uid);
    batch.delete(userDocRef);

    // Function to delete all documents in a given subcollection
    const deleteSubcollection = async (subcollectionName) => {
      const subcollectionRef = collection(
        db,
        "Users",
        user.uid,
        subcollectionName
      );
      const subcollectionSnapshot = await getDocs(subcollectionRef);
      subcollectionSnapshot.forEach((subDoc) => {
        batch.delete(subDoc.ref);
      });
    };

    // Delete documents in nested collections
    await deleteSubcollection("FeedbackComment");
    await deleteSubcollection("FeedbackStars");

    // Commit the batch
    await batch.commit();
    console.log("Firestore documents deleted successfully");

    // Delete the user from Firebase Authentication
    await deleteUser(user);
    console.log("User deleted from Firebase Auth");

    return { success: true };
  } catch (error) {
    console.error("Error deleting user and data:", error);
    return { success: false, error };
  }
};
