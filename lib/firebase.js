import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD0tgvQGYtoAkmEFjREoI3FhCQOqfxrPGo",
  authDomain: "household-app-bf5f7.firebaseapp.com",
  projectId: "household-app-bf5f7",
  storageBucket: "household-app-bf5f7.firebasestorage.app",
  messagingSenderId: "839663967790",
  appId: "1:839663967790:web:78e9651f3066fcc0aa49bf"
};

const app = initializeApp(firebaseConfig);


//Added for member login on 05/05/2026
export const db = getFirestore(app);

export default app;