import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAFsAonuenBSeEdlJH5EMLLBlsp1xg72s0",
    authDomain: "mineria-firebase.firebaseapp.com",
    projectId: "mineria-firebase",
    storageBucket: "mineria-firebase.appspot.com",
    messagingSenderId: "37837303491",
    appId: "1:37837303491:web:cf18ee02a1dd56b1813c76"
  };

const app = firebase.initializeApp(firebaseConfig);

const db = app.firestore();

export default{
    firebase,
    db,
};