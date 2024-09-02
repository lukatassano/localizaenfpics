import { AxiosResponse } from 'axios';
import { api } from '../api/api';
import { FormType } from '../types/form';

export const listNurses = async (): Promise<AxiosResponse<FormType[] | null>> => {
  return api.get("/nurses")
};

// export const listNurses = async (): Promise<FormType[] | null> => {
//   const dbRef = ref(db);
//   try {
//     const snapshot = await get(child(dbRef, `nurses`));
//     if (snapshot.exists()) {
//       return Object.values(snapshot.val());
//     } else {
//       console.log("No data available");
//       return null;
//     }
//   } catch (error) {
//     console.error("Error querying data: ", error);
//     throw error;
//   }
// };
