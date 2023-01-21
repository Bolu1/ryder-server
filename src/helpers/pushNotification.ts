const admin = require('firebase-admin');
const serviceAccount = require("../../firebasestuff.json")

// Initialize the Firebase Admin SDK with a service account JSON file
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const sendToMultipleDevices = (title, body) =>{

    // Get the FCM tokens for the target devices
    const firebaseTokens = ['cXqN7dghSGaCIWT_CM4jZx:APA91bFTsLPwe8eEz4GnAtf6sLJaFBzxN8M0PEOtqm9qEZxDTT-IA9woaz0CrraEu4mC2gl0j4iq_QVJ94eezDKDSfEQ_N_oFXMKawRot16LbB4WRX-BWkT4XPNK3Y8MTK5ysDGK9mDq', 
    'ehMlqNRjT9mYJpCz9tpAk9:APA91bE4eOUrcuSZKYNBW2JJiQm6mfKMpucbqFUTCUdJ9D8QhEuxXCIrUMiyj9bbYLim5ko3aPb11g-sIbWE3l5R0pGf7WQNUNzSEiQHTrsJuL3lAeg-SwJvEihoAyQ0mdnF1dGLa4bG'];
    
    // Create the notification payload
    const payload = {
      notification: {
        title: 'Notification Title',
        body: 'This is an example notification',
      },
      data: {
        // Additional data goes here
      },
    };
    
    // Send the notification to the target devices
    admin.messaging().sendToDevice(firebaseTokens, payload)
      .then((response) => {
        console.log('Notification sent successfully:', response);
      })
      .catch((error) => {
        console.log('Error sending notification:', error);
      });
}

const sendToOneDevice = (token, title, body)=>{


// Get the FCM token for the target device
const firebaseToken = 'ehMlqNRjT9mYJpCz9tpAk9:APA91bE4eOUrcuSZKYNBW2JJiQm6mfKMpucbqFUTCUdJ9D8QhEuxXCIrUMiyj9bbYLim5ko3aPb11g-sIbWE3l5R0pGf7WQNUNzSEiQHTrsJuL3lAeg-SwJvEihoAyQ0mdnF1dGLa4bG';

// Create the notification payload
const payload = {
  notification: {
    title: 'Notification Title',
    body: 'Ya big man BIG MAN',
  },
  data: {
    // Additional data goes here
  },
};

// Send the notification to the target device
admin.messaging().sendToDevice(firebaseToken, payload)
  .then((response) => {
    console.log('Notification sent successfully:', response);
  })
  .catch((error) => {
    console.log('Error sending notification:', error);
  });
}

export default {sendToMultipleDevices, sendToOneDevice}