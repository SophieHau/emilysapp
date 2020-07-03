import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';
import 'firebase/messaging';
import { colors } from './assets/js/colorlist';

const config = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
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
export const storageRef = storage.ref();

export const messaging = firebase.messaging();

// messaging.usePublicVapidKey("BHOR4XJE1UBzJk7Su1nettzX9QVFh0IxeeujDRQSIa9Cl7Aipd2m3VgOSGTm-YzcF51AcJ1xOjg6z6RjQKWFGdc");


if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
      const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
          updateViaCache: 'none'
      });
      messaging.useServiceWorker(registration);
      messaging.onMessage((payload) => {
        const title = payload.notification.title;
        const options = {
            body: payload.notification.body,
            icon: payload.notification.icon,
            actions: [
                {
                    action: payload.fcmOptions.link,
                    title: 'Book Appointment'
                }
            ]
        };
        registration.showNotification(title, options);           
    });
  });
}

messaging.requestPermission()
.then(()=> {
  console.log('granted');
  return messaging.getToken();
})
.then(token => console.log(token))
.catch(err=> console.log('error'))

messaging.onMessage(payload => {
  console.log('onMessage', payload);
});

// // Callback fired if Instance ID token is updated.
// messaging.onTokenRefresh(() => {
//   messaging.getToken().then((refreshedToken) => {
//     console.log('Token refreshed.');
//   }).catch((err) => {
//     console.log('Unable to retrieve refreshed token ', err);
//   });
// });


const provider = new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({  prompt: 'select_account' });
export const signInWithGoogle = () => auth.signInWithPopup(provider);


export const createUserProfileDocument = async (userAuth, additionalData) => {
  if (!userAuth) return;

  const userRef = firestore.doc(`users/${userAuth.uid}`);
  const snapShot = await userRef.get();

  const randIndex = Math.floor((Math.random() * colors.length) + 1);
  const color = colors[randIndex]

  if (!snapShot.exists) {
      const { displayName, email } = userAuth;
      const createdAt = new Date();

      try {
          await userRef.set({
              displayName,
              email,
              createdAt,
              color,
              ...additionalData
          })
      } catch(error){
          console.log('error creating user', error.message);
      }
  }
  return userRef;
};

export const getProfilePicUrl = async (user) => {
  const currentImagePath = user.imagePath
  const currentImageRef = storageRef.child(currentImagePath)
  const currentImageUrl = await currentImageRef.getDownloadURL()
  return currentImageUrl
}

export default firebase;