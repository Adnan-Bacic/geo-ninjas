import firebase from 'firebase'
import firestore from 'firebase/firestore'

// Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyB-UGMFNUP4u3LzqXZ9tD1-Q3Z2-K4M7rw",
    authDomain: "udemy-geo-ninjas-f3dd8.firebaseapp.com",
    databaseURL: "https://udemy-geo-ninjas-f3dd8.firebaseio.com",
    projectId: "udemy-geo-ninjas-f3dd8",
    storageBucket: "udemy-geo-ninjas-f3dd8.appspot.com",
    messagingSenderId: "835299845708",
    appId: "1:835299845708:web:521afadbc6641f2db2f6e9"
  };
  // Initialize Firebase
  //firebase.initializeApp(firebaseConfig);
  const firebaseApp = firebase.initializeApp(firebaseConfig);
  //export with database
  export default firebaseApp.firestore();