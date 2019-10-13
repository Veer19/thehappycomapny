const firebaseConfig = {
    apiKey: "AIzaSyDisgdaxhCNvv_ArzKgYmX97dy_y_hXN2M",
    authDomain: "thehappycompany-18.firebaseapp.com",
    databaseURL: "https://thehappycompany-18.firebaseio.com",
    projectId: "thehappycompany-18",
    storageBucket: "thehappycompany-18.appspot.com",
    messagingSenderId: "480614158221",
    appId: "1:480614158221:web:80bcb1882bae9a9c87f7c4"
  };
import firebase from 'firebase'
import 'firebase/firestore'
firebase.initializeApp(firebaseConfig)
const db = firebase.firestore();
const auth = firebase.auth();
export default {db,auth}