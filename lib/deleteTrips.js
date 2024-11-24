import {
  doc,
  deleteDoc,
  collection,
  getDocs,
  writeBatch,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

const deleteCollection = async (collectionRef) => {
  const querySnapshot = await getDocs(collectionRef);
  const batch = writeBatch(db);
  querySnapshot.forEach((doc) => {
    batch.delete(doc.ref);
  });
  await batch.commit();
};

const deleteTrips = async (tripId) => {
  try {
    const tripDocRef = doc(db, "Trips", tripId);
    const subcollections = ["FeedbackComment", "FeedbackStars"]; // Замість цього використовуйте реальні назви підколекцій

    for (const subcollection of subcollections) {
      const subcollectionRef = collection(tripDocRef, subcollection);
      await deleteCollection(subcollectionRef);
    }

    await deleteDoc(tripDocRef);
    console.log("Trip and its subcollections successfully deleted");
  } catch (error) {
    console.error("Error deleting trip: ", error);
    throw new Error("Failed to delete trip");
  }
};

export default deleteTrips;
