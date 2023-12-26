var design = anime({
  targets: 'svg #XMLID5',
  keyframes: [
    {translateX: -500},
    {rotateY: 180},
    {translateX: 920},
    {rotateY: 0},
    {translateX: -500},
    {rotateY: 180},
    {translateX: -500},
  ],
  easing: 'easeInOutSine',
  duration: 60000,
});
anime({
  targets: '#dust-paarticle path',
  translateY: [10, -150],
  direction: 'alternate',
  loop: true,
  delay: function(el, i, l) {
    return i * 100;
  },
  endDelay: function(el, i, l) {
    return (l - i) * 100;
  }
});


var firebaseConfig = {
    apiKey: "AIzaSyAV6XuYy9Di1rsfeJUZ3LmQ6X433AT9XEs",
    authDomain: "beezy-1454d.firebaseapp.com",
 databaseURL:"https://beezy-1454d-default-rtdb.firebaseio.com/",
    projectId: "beezy-1454d",
    storageBucket: "beezy-1454d.appspot.com",
    messagingSenderId: "229706759201",
    appId: "1:229706759201:web:a12bd33ff9d327a4657760",
    measurementId: "G-008E8JJ49C"
  };

  firebase.initializeApp(firebaseConfig);

  // Function to save form data to Firestore and contact the user
function saveFormDataAndContactUser() {
  var email = document.getElementById('forgotEmailInput').value;
  var whatsappNumber = document.getElementById('whatsappNumberInput').value;

  // Save form data to Firestore collection 'Passwordtrouble'
  saveFormDataToFirestore(email, whatsappNumber);

  // Display message to the user
  displayMessage('We will get back to you shortly.', 'info');
}

// Function to save form data to Firestore collection 'Passwordtrouble'
function saveFormDataToFirestore(email, whatsappNumber) {
  var db = firebase.firestore();
  var collectionRef = db.collection('Passwordtrouble');

  // Save form data to Firestore
  collectionRef.add({
    email: email,
    whatsappNumber: whatsappNumber,
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  })
  .then((docRef) => {
    console.log('Form data saved to Firestore:', docRef.id);
  })
  .catch((error) => {
    console.error('Error saving form data to Firestore:', error);
  });
}

// Function to display messages
function displayMessage(message, messageType) {
  var messageElement = document.getElementById('message');
  if (messageElement) {
    messageElement.innerHTML = message;
    messageElement.className = messageType;
    messageElement.style.display = 'block';
  }
}

  