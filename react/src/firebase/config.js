import * as firebase from 'firebase/app'
import 'firebase/firestore'

var firebaseConfig = {
    apiKey: "AIzaSyC_D5A4JVRKeUvaeqvfsQ2paxNEOi6Pp2U",
    authDomain: "skull-online-313fe.firebaseapp.com",
    projectId: "skull-online-313fe",
    storageBucket: "skull-online-313fe.appspot.com",
    messagingSenderId: "578706291533",
    appId: "1:578706291533:web:3d44f8bd18af51833bd504"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  const projectFirestore = firebase.firestore()
  export {projectFirestore}