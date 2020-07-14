const { messaging } = require("firebase");

importScripts('https://www.gstatic.com/firebasejs/7.15.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.15.0/firebase-messaging.js');


firebase.initializeApp({
    apiKey: API_KEY,
    authDomain: "emilys-app-f1604.firebaseapp.com",
    databaseURL: "https://emilys-app-f1604.firebaseio.com",
    projectId: "emilys-app-f1604",
    storageBucket: "emilys-app-f1604.appspot.com",
    messagingSenderId: "207902982889",
    appId: "1:207902982889:web:d14790104742e04092e678"
  });


if (firebase.messaging.isSupported()) {
  const messaging = firebase.messaging()
  messaging.usePublicVapidKey("VAPIDKEY")
}


