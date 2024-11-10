import { auth, googleProvider, facebookProvider } from "@/lib/firebase";
import { signInWithPopup } from "firebase/auth";
import { doc, getDoc, setDoc, collection, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase"; // Імпорт Firestore

// Функція для оновлення або створення користувача з вкладеними колекціями
const updateUserInFirestore = async (user) => {
  const userRef = doc(db, "Users", user.uid);
  const docSnap = await getDoc(userRef);

  // Створення поточної дати
  const currentDate = new Date();

  // Віднімаємо 18 років
  currentDate.setFullYear(currentDate.getFullYear() - 18);

  if (!docSnap.exists()) {
    // Якщо користувач не існує, створюємо новий документ із початковими полями
    await setDoc(userRef, {
      name: user.displayName || "Guest",
      nickname: "",
      profileImage: user.photoURL || "/noavatar.png",
      // birthday: "",
      birthday: Timestamp.fromDate(currentDate), // Встановлюємо дату народження 18 років
      gender: "",
      aboutMe: "",
      activeTravels: [],
      travelCompanions: [],
      travels: [],
      isPrivate: false,
      isPremium: false,
    });

    // Створюємо вкладені колекції `FeedbackComment` та `FeedbackStars`
    const feedbackCommentRef = doc(collection(userRef, "FeedbackComment"));
    const feedbackStarsRef = doc(collection(userRef, "FeedbackStars"));

    // Записуємо початкові дані в ці колекції (можна залишити порожніми)
    await setDoc(feedbackCommentRef, {});
    await setDoc(feedbackStarsRef, {});

    return false; // Повертаємо false, щоб позначити, що користувач новий
  }
  return true; // Користувач існує
};

// Google Sign-In
export const signInWithGoogle = async (router) => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const isUserExisting = await updateUserInFirestore(result.user);

    // Перенаправляємо на сторінку залежно від статусу користувача
    router.push(isUserExisting ? "/en/Main" : "/en/Profile");
  } catch (error) {
    handleAuthError(error);
  }
};

// Facebook Sign-In
export const signInWithFacebook = async (router) => {
  try {
    const result = await signInWithPopup(auth, facebookProvider);
    const isUserExisting = await updateUserInFirestore(result.user);

    router.push(isUserExisting ? "/en/Main" : "/en/Profile");
  } catch (error) {
    handleAuthError(error);
  }
};

// Обробка помилок авторизації
const handleAuthError = (error) => {
  if (error.code === "auth/cancelled-popup-request") {
    console.warn("Запит авторизації було скасовано.");
  } else if (error.code === "auth/popup-closed-by-user") {
    console.warn("Користувач закрив вікно авторизації.");
  } else {
    console.error("Помилка під час авторизації:", error);
  }
};
