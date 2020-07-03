importScripts('https://www.gstatic.com/firebasejs/7.15.5/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.15.5/firebase-messaging.js');

firebase.initializeApp({
  'messagingSenderId': '207902982889'
});

  
const messaging = firebase.messaging();

// messaging.usePublicVapidKey("BHOR4XJE1UBzJk7Su1nettzX9QVFh0IxeeujDRQSIa9Cl7Aipd2m3VgOSGTm-YzcF51AcJ1xOjg6z6RjQKWFGdc");

self.addEventListener('notificationclick', (event) => {
  if (event.action) {
      clients.openWindow(event.action);
  }
  event.notification.close();
}); 