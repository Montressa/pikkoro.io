let slideIndex = 0;

function showSlides() {
    let slides = document.getElementsByClassName("slide");
    
    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    
    slideIndex++;
    
    if (slideIndex > slides.length) {
        slideIndex = 1;
    }
    
    slides[slideIndex - 1].style.display = "block";
    
    setTimeout(showSlides, 2000); // Change slide every 2 seconds (2000 milliseconds)
}

showSlides(); // Start the slideshow
const firebaseConfig = {
    apiKey: "AIzaSyAV6XuYy9Di1rsfeJUZ3LmQ6X433AT9XEs",
    authDomain: "beezy-1454d.firebaseapp.com",
 databaseURL:"https://beezy-1454d-default-rtdb.firebaseio.com/",
    projectId: "beezy-1454d",
    storageBucket: "beezy-1454d.appspot.com",
    messagingSenderId: "229706759201",
    appId: "1:229706759201:web:a12bd33ff9d327a4657760",
    measurementId: "G-008E8JJ49C"
  };
// Initialize Firebase with your config


firebase.initializeApp(firebaseConfig);
const dbRef = firebase.database().ref();
const auth = firebase.auth();




// Function to play the sound
function playButtonClickSound() {
    // Replace 'path/to/button-sound.mp3' with the actual path to your sound file
    var audio = new Audio('select-sound-121244.mp3');
    audio.play();
}

// Event listeners for button clicks
document.getElementById('submit-word').addEventListener('click', function () {
    playButtonClickSound();
    // Add submit functionality if needed
});

document.getElementById('logout-button').addEventListener('click', function () {
    playButtonClickSound();
    // Add logout functionality if needed
});

// References to HTML elements
const wordInput = document.getElementById("word-input");
const submitWord = document.getElementById("submit-word");
const errorMessage = document.getElementById("error-message");
const userEmail = document.getElementById("user-email");
const subscriptionStatus = document.getElementById("subscription-status");
const subscriptionDuration = document.getElementById("subscription-duration");

// Firebase Authentication State Listener
auth.onAuthStateChanged(user => {
    if (user) {
        // User is signed in
        const welcomeMessage = document.getElementById("welcome-message");
        welcomeMessage.textContent = "Welcome!";
        userEmail.textContent = "Email: " + user.email;

        // Display user information if the user is authenticated
        dbRef.child("users/" + user.uid + "/subscription").on("value", snapshot => {
            const subscription = snapshot.val();
            if (subscription) {
                if (subscription.status) {
                    subscriptionStatus.textContent = "Subscription Status: Active";
                    subscriptionDuration.textContent = "Subscription Expires At: " + new Date(subscription.expiresAt);

                    // Redirect to the content page when the user has an active subscription
                    window.location.href = "feed.html";
                } else {
                    subscriptionStatus.textContent = "Subscription Status: Inactive";
                    subscriptionDuration.textContent = "Subscription Expires At: N/A";
                }
            }
        });
    } else {
        // User is not signed in, handle as needed
        const welcomeMessage = document.getElementById("welcome-message");
        welcomeMessage.textContent = "You are not logged in.";
        userEmail.textContent = "";
        subscriptionStatus.textContent = "";
        subscriptionDuration.textContent = "";
    }
});

// Event listener for submitting a word
submitWord.addEventListener("click", () => {
    const user = firebase.auth().currentUser; // Retrieve the current user
    if (!user) {
        // Handle case when the user is not logged in
        errorMessage.textContent = "You must be logged in to submit a word.";
        errorMessage.classList.remove("hidden");
        return;
    }

    const enteredWord = wordInput.value;

    // Check if the entered word exists and has a flag set to true in the database
    dbRef.child("subscriptions/words/" + enteredWord).once("value")
        .then(snapshot => {
            const wordData = snapshot.val();
            if (wordData && wordData.flag === true) {
                // Word is valid, update the user's subscription status and duration
                // Check if the word has already been used for the user's subscription
                dbRef.child("users/" + user.uid + "/subscription/usedWords").once("value")
                    .then(usedWordsSnapshot => {
                        const usedWords = usedWordsSnapshot.val() || {};
                        if (!usedWords[enteredWord]) {// Calculate the timestamp for 1 month from the current time
const expiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000; // 30 days * 24 hours/day * 60 minutes/hour * 60 seconds/minute * 1000 milliseconds/second
dbRef.child("users/" + user.uid + "/subscription").set({ status: true, expiresAt });

                            
                            // Mark the word as used
                            usedWords[enteredWord] = true;
                            dbRef.child("users/" + user.uid + "/subscription/usedWords").set(usedWords);

                            // Redirect to the content page
                            window.location.href = "feed.html";
                        } else {
                            // Word has already been used
                            errorMessage.textContent = "This word has already been used.";
                            errorMessage.classList.remove("hidden");
                        }
                    })
                    .catch(error => {
                        console.error(error);
                        errorMessage.textContent = "An error occurred. Please try again.";
                        errorMessage.classList.remove("hidden");
                    });
            } else {
                // Word is not valid, display an error message
                errorMessage.textContent = "Invalid word. Please try again.";
                errorMessage.classList.remove("hidden");
            }
        })
        .catch(error => {
            console.error(error);
            errorMessage.textContent = "An error occurred. Please try again.";
            errorMessage.classList.remove("hidden");
        });
});


        // Logout Button
        const logoutButton = document.getElementById("logout-button");
        logoutButton.addEventListener("click", () => {
            firebase.auth().signOut().then(() => {
                // User has been signed out, redirect to the login/signup page
                window.location.href = "index-login.html";
            }).catch(error => {
                console.error(error);
            });
        });