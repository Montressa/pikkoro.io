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

  // Function to check user login status and redirect if necessary
function checkLoginStatus() {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      // User is logged in
      var userId = user.uid;
      var usersRef = firebase.database().ref('users').child(userId);

      // Check the user's login status
      usersRef.child('login').child('status').once('value', (snapshot) => {
        var loginStatus = snapshot.val();

        // If login status is true, aggressively redirect to feed.html
        if (loginStatus === true) {
          window.location.replace('feed.html');
        }
        // If login status is false, keep the user on the login page
        // You can add additional logic here if needed
      });
    }
    // If user is not logged in, no action needed
  });
}

// Call the checkLoginStatus function on page load
window.onload = function () {
  checkLoginStatus();
};

// Function to handle login
function login() {
  var email = document.getElementById('emailInput').value;
  var password = document.getElementById('passwordInput').value;

  firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Handle successful login
      var user = userCredential.user;
      console.log('Login successful:', user);

      // Update user's login status to true
      var userId = user.uid;
      var usersRef = firebase.database().ref('users').child(userId);
      usersRef.child('login').child('status').set(true);

      // Display success message
      displayMessage('Login successful!', 'success');

      // Redirect to subscription.html after successful login
      window.location.href = 'subscription.html';
    })
    .catch((error) => {
      // Handle errors
      var errorCode = error.code;
      var errorMessage = error.message;
      console.error('Login error:', errorCode, errorMessage);

      // Display error message
      displayMessage('Email or password is incorrect.', 'error');
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


  