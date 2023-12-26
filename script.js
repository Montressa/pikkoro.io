document.addEventListener("DOMContentLoaded", function () {
    // Show the tutorial container when the page loads
    showTutorial();
});

function showTutorial() {
    const tutorialContainer = document.getElementById("tutorial-container");
    if (tutorialContainer) {
        tutorialContainer.style.display = "block";
    }
}

function dismissTutorial() {
    const tutorialContainer = document.getElementById("tutorial-container");
    if (tutorialContainer) {
        tutorialContainer.style.display = "none";
    }
}

document.getElementById('watchButton').addEventListener('click', function() {
  var audio = document.getElementById('buttonSound');
  var loader = document.getElementById('loader');

  // Display loader
  loader.style.display = 'block';

  audio.play();

  audio.addEventListener('ended', function() {
    // Hide loader after a delay (e.g., 3 seconds)
    setTimeout(function() {
      loader.style.display = 'none';
      // Redirect user
      window.location.href = 'index-login.html';
    }, 3000);
  });
});

