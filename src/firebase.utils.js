import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

const config = {
  apiKey: "",
  authDomain: "emilys-app-f1604.firebaseapp.com",
  databaseURL: "https://emilys-app-f1604.firebaseio.com",
  projectId: "emilys-app-f1604",
  storageBucket: "emilys-app-f1604.appspot.com",
  messagingSenderId: "207902982889",
  appId: "1:207902982889:web:d14790104742e04092e678"
};

firebase.initializeApp(config);

export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const storage = firebase.storage();


const provider = new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({  prompt: 'select_account' });
export const signInWithGoogle = () => auth.signInWithPopup(provider);


export const createUserProfileDocument = async (userAuth, additionalData) => {
  if (!userAuth) return;

  const userRef = firestore.doc(`users/${userAuth.uid}`);
  const snapShot = await userRef.get();

  if (!snapShot.exists) {
      const { displayName, email } = userAuth;
      const createdAt = new Date();

      try {
          await userRef.set({
              displayName,
              email,
              createdAt,
              ...additionalData
          })
      } catch(error){
          console.log('error creating user', error.message);
      }
  }
  return userRef;
};

export default firebase;


        // const message_list = []

        // firestore.collectionGroup('messages')
        //     .onSnapshot({
        //         includeMetadataChanges: true
        //         },
        //         querySnapshot => {
        //             querySnapshot.forEach(doc => {
        //             message_list.push({
        //                 id: doc.id,
        //                 ...doc.data()
        //             })
                        
        //         })
        //         console.log(message_list)
        //         this.setState({messages: message_list})
        //         },
        //         error => {
        //             console.log(error)
        //         }
        // );