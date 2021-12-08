import firebase from "firebase";
import Vue from "vue";

const config = {
    apiKey: "AIzaSyAmlJQl04tbwNNKt6mlUwdhD_QnHVeHQG4",
    authDomain: "myjs2-ebd59.firebaseapp.com",
    projectId: "myjs2-ebd59",
    storageBucket: "myjs2-ebd59.appspot.com",
    messagingSenderId: "606649183557",
    appId: "1:606649183557:web:9a7336eccb427ee529622c"
};
firebase.initializeApp(config);
const db=firebase.firestore();
const auth=firebase.auth();
const storage=firebase.storage().ref();
Vue.use(firebase);
export {db,auth,storage};