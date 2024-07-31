// listNurses.ts
import { db } from '../firebase.config';
import { ref, get, child } from "firebase/database";
import { CompleteFormType } from '../types/form';

export const listNurses = async (): Promise<CompleteFormType[] | null> => {
  console.log("asd");
  
  const dbRef = ref(db);
  try {
    const snapshot = await get(child(dbRef, `nurses`));
    if (snapshot.exists()) {
      return Object.values(snapshot.val());
    } else {
      console.log("No data available");
      return null;
    }
  } catch (error) {
    console.error("Error querying data: ", error);
    throw error;
  }
};
