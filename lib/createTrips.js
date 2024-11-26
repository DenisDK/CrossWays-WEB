import {
  collection,
  addDoc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, db } from "./firebase";

const createTrip = async (tripData) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("User not authenticated");
    }

    const storage = getStorage();
    const photoFile = tripData.get("photo");
    const photoRef = ref(storage, `photos/${photoFile.name}`);

    // Загрузка фото в хранилище Firebase
    await uploadBytes(photoRef, photoFile);
    const photoURL = await getDownloadURL(photoRef);

    const tripDocRef = await addDoc(collection(db, "Trips"), {
      country: tripData.get("country"),
      createdAt: serverTimestamp(),
      creatorId: user.uid,
      description: tripData.get("description"),
      from: tripData.get("dateFrom")
        ? Timestamp.fromDate(new Date(tripData.get("dateFrom")))
        : null,
      to: tripData.get("dateTo")
        ? Timestamp.fromDate(new Date(tripData.get("dateTo")))
        : null,
      imageUrl: photoURL,
      memberLimit: Number(tripData.get("memberLimit")),
      participants: [user.uid], // Додавання автора до списку учасників
      requests: [],
      status: true,
      title: tripData.get("title"),
    });

    // Создание подколлекций FeedbackComment и FeedbackStars
    await addDoc(collection(tripDocRef, "FeedbackComment"), {
      // Поля для FeedbackComment
    });

    await addDoc(collection(tripDocRef, "FeedbackStars"), {
      // Поля для FeedbackStars
    });

    console.log("Trip created with ID: ", tripDocRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

export default createTrip;
