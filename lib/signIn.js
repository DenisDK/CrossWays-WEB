import { auth, googleProvider, facebookProvider } from "@/lib/firebase";
import { signInWithPopup } from "firebase/auth";

// Google Sign-In
export const signInWithGoogle = async (router) => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    console.log("Google user:", result.user);
    router.push("/Main");
  } catch (error) {
    if (error.code === "auth/cancelled-popup-request") {
      console.warn("Запит авторизації було скасовано.");
    } else if (error.code === "auth/popup-closed-by-user") {
      console.warn("Користувач закрив вікно авторизації.");
    } else {
      console.error("Помилка під час авторизації через Google:", error);
    }
  }
};

// Facebook Sign-In
export const signInWithFacebook = async (router) => {
  try {
    const result = await signInWithPopup(auth, facebookProvider);
    console.log("Facebook user:", result.user);
    router.push("/Main");
  } catch (error) {
    if (error.code === "auth/cancelled-popup-request") {
      console.warn("Запит авторизації було скасовано.");
    } else if (error.code === "auth/popup-closed-by-user") {
      console.warn("Користувач закрив вікно авторизації.");
    } else {
      console.error("Помилка під час авторизації через Facebook:", error);
    }
  }
};
