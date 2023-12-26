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

// Function to handle signup
function signup() {
  var email = document.getElementById('signupEmailInput').value;
  var password = document.getElementById('signupPasswordInput').value;
  var confirmPassword = document.getElementById('confirmPasswordInput').value;

  // Check if passwords match
  if (password !== confirmPassword) {
    displayMessage('Passwords do not match.', 'error');
    return;
  }

  // Create user in Firebase Authentication
  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Handle successful signup
      var user = userCredential.user;
      console.log('Signup successful:', user);

      // Add user to Firebase Realtime Database and set login status to true
      var userId = user.uid;
      var usersRef = firebase.database().ref('users');
      usersRef.child(userId).set({
        email: email,
        subscription: {
          status: false,
          expiresAt: null
        },
        login: {
          status: true
        }
      });

      // Display success message
      displayMessage('Signup successful! You can now login.', 'success');

      // Redirect to subscription.html after successful signup
      window.location.href = 'index-login.html';
    })
    .catch((error) => {
      // Handle signup errors
      var errorCode = error.code;
      var errorMessage = error.message;
      console.error('Signup error:', errorCode, errorMessage);

      // Display error message
      displayMessage(errorMessage, 'error');
    });
}

// Function to display messages
function displayMessage(message, messageType) {
  var messageElement = document.getElementById('message');
  if (messageElement) {
    messageElement.innerHTML = message;
    messageElement.className = messageType;
    messageElement.style.display = 'block';

    // Hide the message after 3 seconds
    setTimeout(function () {
      messageElement.style.display = 'none';
    }, 3000);
  }
}



  