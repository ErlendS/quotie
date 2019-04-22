import firebase from "firebase";
import "firebase/firestore";

firebase.initializeApp({
  apiKey: "AIzaSyAIDZczRImlV5qrPgOlZUcDcKw3wG0iC2A",
  authDomain: "quotie-quotie.firebaseapp.com",
  databaseURL: "https://quotie-quotie.firebaseio.com",
  projectId: "quotie-quotie",
  storageBucket: "quotie-quotie.appspot.com",
  messagingSenderId: "256815436581"
});

export default (db = firebase.firestore());
