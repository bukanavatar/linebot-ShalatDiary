import firebase from 'firebase';

const config = {
    apiKey: "AIzaSyCAveXkK3a66orD-6ouTnj7S_FPIS6yQ-I",
    authDomain: "shalatdiary.firebaseapp.com",
    databaseURL: "https://shalatdiary.firebaseio.com",
    projectId: "shalatdiary",
    storageBucket: "shalatdiary.appspot.com",
    messagingSenderId: "761448883159"
};
firebase.initializeApp(config);

export default firebase