// Define the audio element and set the source
const audio = new Audio('tap-notification-180637.mp3');
// Function to play sound
const playSound = () => {
  audio.play();  // Play the audio when the function is called
};
// Add click event listener to toggle the popup
document.getElementById('toggleButton').addEventListener('click', () => {
  playSound();  // Call the playSound function to play the audio
  $('#popup').modal('toggle');  // Toggle the popup using Bootstrap's modal
});


function fetchAndDisplayMovies(sectionId, url) {
  fetch(url)
    .then(response => response.json())
    .then(data => {
      const cardContainer = document.querySelector(`#${sectionId} .card-container`);

      if (data && (data.movies || data.nollywoodFilms || data.cartoons)) {
        const moviesArray = data.movies || data.nollywoodFilms || data.cartoons;

        moviesArray.forEach(movie => {
          const card = createCard(movie, cardContainer);

          // Add click event listener with conditional redirect
          card.addEventListener('click', () => {
            const title = card.querySelector('.card-title').textContent;
            const redirectUrl = sectionId === 'nollywood-films' ? 'nolly.html' : 'info.html';
            window.location.href = `${redirectUrl}?title=${title}`;
          });
        });

        const shufflingInterval = 10 * 60 * 1000; // 10 minutes in milliseconds
        setInterval(() => {
          shuffleCards(cardContainer);
        }, shufflingInterval);

      } else {
        console.error('Invalid JSON structure:', data);
      }
    })
    .catch(error => console.error('Error fetching data:', error));
}

function createCard(movie, cardContainer) {
  const card = document.createElement('div');
  card.classList.add('card');

  const img = document.createElement('img');
  img.src = movie.poster;

  const title = document.createElement('h4');
  title.classList.add('card-title');
  title.textContent = movie.title;

  card.appendChild(img);
  card.appendChild(title);

  // Append card to container
  cardContainer.appendChild(card);
  return card; // Return the created card for event listener attachment
}

function shuffleCards(cardContainer) {
  const cards = Array.from(cardContainer.getElementsByClassName('card'));
  cards.forEach(card => {
    cardContainer.removeChild(card);
  });

  // Shuffle the cards array
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }

  // Append shuffled cards to the container
  cards.forEach(card => {
    cardContainer.appendChild(card);
  });
}

// Fetch and display data for each section, using correct file names
fetchAndDisplayMovies('movies', 'movies.json');
fetchAndDisplayMovies('nollywood-films', 'nollywood.json');
fetchAndDisplayMovies('cartoons-animations', 'animation.json');


// Optional JavaScript for search functionality
const searchBtn = document.querySelector('.search-btn');
const searchBox = document.querySelector('.search-box');
const resultsContainer = document.getElementById('results-container');

let searchTimeout;

searchBtn.addEventListener('click', async () => {
    const searchTerm = searchBox.value.trim().toLowerCase();

    if (searchTerm === '') {
        displayMessage('Please enter a title');
        return;
    }

    const allJsonFiles = ['tv-series.json', 'movies.json', 'animation.json', 'nollywood.json'];

    let foundResults = [];

    for (const jsonFile of allJsonFiles) {
        const jsonData = await fetchJsonData(jsonFile);

        if (jsonData) {
            const results = searchInJson(jsonData, searchTerm);
            foundResults = foundResults.concat(results);
        }
    }

    if (foundResults.length > 0) {
        displayResults(foundResults);
        addCardClickListener(foundResults);

        // Clear results and input container after 3 minutes
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            clearSearchResults();
        }, 180000); // 180000 milliseconds = 3 minutes
    } else {
        displayMessage('Coming to Piccolo Soon');
    }
});

async function fetchJsonData(jsonFile) {
    try {
        const response = await fetch(jsonFile);
        const jsonData = await response.json();
        return jsonData;
    } catch (error) {
        console.error(`Error fetching ${jsonFile}:`, error);
        return null;
    }
}

function searchInJson(jsonData, searchTerm) {
    const results = [];

    for (const category in jsonData) {
        if (jsonData.hasOwnProperty(category)) {
            jsonData[category].forEach((item) => {
                if (item.title.toLowerCase().includes(searchTerm)) {
                    results.push(item);
                }
            });
        }
    }

    return results;
}

function displayResults(results) {
    resultsContainer.innerHTML = '';

    results.forEach((result) => {
        const card = document.createElement('div');
        card.classList.add('result-card');

        const img = document.createElement('img');
        img.src = result.poster;
        img.alt = result.title;

        const title = document.createElement('p');
        title.textContent = result.title;

        card.appendChild(img);
        card.appendChild(title);
        resultsContainer.appendChild(card);
    });
}

function addCardClickListener(results) {
    const resultCards = document.querySelectorAll('.result-card');

    resultCards.forEach((card, index) => {
        card.addEventListener('click', () => {
            const selectedTitle = results[index].title;
            window.location.href = `info.html?title=${encodeURIComponent(selectedTitle)}`;
        });
    });
}

function displayMessage(message) {
    resultsContainer.innerHTML = `<p>${message}</p>`;
}

function clearSearchResults() {
    resultsContainer.innerHTML = '';
    searchBox.value = '';
}


const firebaseConfig = {
  apiKey: "AIzaSyAV6XuYy9Di1rsfeJUZ3LmQ6X433AT9XEs",
  authDomain: "beezy-1454d.firebaseapp.com",
  databaseURL: "https://beezy-1454d-default-rtdb.firebaseio.com/",
  projectId: "beezy-1454d",
  storageBucket: "beezy-1454d.appspot.com",
  messagingSenderId: "229706759201",
  appId: "1:229706759201:web:a12bd33ff9d327a4657760",
  measurementId: "G-008E8JJ49C"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const dbRef = firebase.database().ref();
const auth = firebase.auth();
let countdownInterval;

// Function to redirect user to login page
function redirectToLogin() {
  window.location.href = 'index-login.html';
}

// Function to redirect user to subscription page
function redirectToSubscription() {
  window.location.href = 'subscription.html';
}

// Function to display the username
function displayUsername(username) {
  const usernameElement = document.getElementById("username");
  usernameElement.innerHTML = `${username}!`;
}

// Function to update the countdown timer
function updateCountdownTimer(expiresAt, username) {
  const countdownTimer = document.getElementById("timer");

  clearInterval(countdownInterval);
  countdownInterval = setInterval(() => {
    const now = Date.now();
    const timeLeft = expiresAt - now;

    if (timeLeft > 0) {
      // Update the countdown timer
      const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

      countdownTimer.innerHTML = `Subscription Status: ${days}d ${hours}h ${minutes}m ${seconds}s`;

      // Display a message indicating the timer was updated
      console.log("Timer updated successfully!");
    } else {
      // Subscription has expired
      clearInterval(countdownInterval);
      redirectToSubscription();
    }
  }, 1000);
}

// Authentication Check
auth.onAuthStateChanged(user => {
  if (user) {
    // User is signed in, retrieve user information from Firebase and Realtime Database
    dbRef.child("users/" + user.uid).on("value", snapshot => {
      const userData = snapshot.val();

      if (userData) {
        if (userData.subscription && userData.subscription.status) {
          // Subscription is active
          const expiresAt = userData.subscription.expiresAt;
          const displayName = user.displayName || user.email || "Default Name";
          updateCountdownTimer(expiresAt, displayName);
          displayUsername(displayName);  // Call the function to display the accurate username
        } else {
          // User doesn't have an active subscription, redirect to subscription.html
          redirectToSubscription();
        }
      }
    });
  } else {
    // User is not logged in, redirect to login.html
    redirectToLogin();
  }
});




// Logout Button
const logoutButton = document.getElementById("logout-button");

logoutButton.addEventListener("click", () => {
  const user = firebase.auth().currentUser;

  if (user) {
    // Update Firebase Realtime Database with the user's login status
    firebase.database().ref("users/" + user.uid + "/loginStatus").set(false);

    // Sign out the user
    firebase.auth().signOut().then(() => {
      // User has been signed out, redirect to the login/signup page
      window.location.href = "index-login.html?logout=true";
    }).catch(error => {
      console.error(error);
    });
  } else {
    // User is not signed in, redirect to login/signup page
    window.location.href = "index-login.html";
  }
});

// Advert
const db = firebase.firestore();

// Function to render content
const renderContent = (content) => {
  const ribbonContainer = document.getElementById('ribbonContainer');

  // Check for IMG and LINK patterns
  const imgPattern = /\(IMG\s*:\s*(.*?)\)/;
  const linkPattern = /\(LINK\s*:\s*(.*?)\)/;

  // Replace IMG pattern with an image element
  const contentWithImages = content.replace(imgPattern, (match, imgSrc) => {
    return `<img src="${imgSrc}" alt="Image" class="content-image">`;
  });

  // Replace LINK pattern with a button element
  const contentWithLinks = contentWithImages.replace(linkPattern, (match, link) => {
    return `<a href="${link}" target="_blank" class="content-link">LINK</a>`;
  });

  // Set the processed content in the ribbon container
  ribbonContainer.innerHTML = contentWithLinks;
};

// Function to fetch and render advert content
const fetchAdvertContent = async () => {
  try {
    const advertDoc = await db.collection('Advert').doc('today').get();

    if (advertDoc.exists) {
      const advertData = advertDoc.data();
      const textContent = advertData.Text;

      // Render the content
      renderContent(textContent);
    } else {
      console.log('No document found for today.');
    }
  } catch (error) {
    console.error('Error fetching advert content:', error);
  }
};

// Call the function to fetch and render content
fetchAdvertContent();




