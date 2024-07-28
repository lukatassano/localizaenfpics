import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCG8t3yG0KWjelL8sTNB3-x1PhoXb6ttwQ",
  authDomain: "pmapa-cf778.firebaseapp.com",
  databaseURL: "https://pmapa-cf778-default-rtdb.firebaseio.com",
  projectId: "pmapa-cf778",
  storageBucket: "pmapa-cf778.appspot.com",
  messagingSenderId: "87300144926",
  appId: "1:87300144926:web:08bbf80a6631bb01af530f",
  measurementId: "G-B8R3ZFXL02"
};

const firebaseApp = initializeApp(firebaseConfig);
export const db = getDatabase(firebaseApp);
// const analytics = getAnalytics(firebaseApp);