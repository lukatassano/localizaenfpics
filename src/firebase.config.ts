// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);