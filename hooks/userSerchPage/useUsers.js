import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

const useUsers = (currentUserId, setLoading) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (currentUserId) {
      const fetchUsers = async () => {
        setLoading(true); // Start loading

        try {
          const usersCollection = collection(db, "Users");
          const usersSnapshot = await getDocs(usersCollection);
          const usersList = usersSnapshot.docs
            .map((doc) => {
              const userData = doc.data();
              const age = userData.birthday
                ? calculateAge(userData.birthday)
                : null;

              return {
                id: doc.id,
                name: userData.name,
                nickname: userData.nickname,
                gender: userData.gender,
                age: age,
                avatar: userData.profileImage || "/noavatar.png",
                isPremium: userData.isPremium,
                isPrivate: userData.isPrivate,
              };
            })
            .filter((user) => user.id !== currentUserId && !user.isPrivate); // Исключаем текущего пользователя и приватных пользователей

          setUsers(usersList);
        } catch (error) {
          console.error("Ошибка при получении пользователей:", error);
        } finally {
          setLoading(false); // End loading
        }
      };

      fetchUsers();
    }
  }, [currentUserId, setLoading]);

  const calculateAge = (birthday) => {
    const birthDate = birthday.toDate();
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  return { users };
};

export default useUsers;
