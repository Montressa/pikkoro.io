document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const title = urlParams.get('title');
  const localStorageKey = `movieData_${title}`;

  // Check if cached data exists and is not expired
  const cachedData = JSON.parse(localStorage.getItem(localStorageKey));
  if (cachedData && (Date.now() - cachedData.timestamp < 2 * 24 * 60 * 60 * 1000)) {
    // Use cached data
    updatePageWithData(cachedData.movie, cachedData.detailedData);
  } else {
    // Fetch data from TMDB
    fetchDataFromTMDB(title);
  }

  function fetchDataFromTMDB(title) {
    const backdropImg = document.querySelector('header img');
    const posterImg = document.querySelector('.poster-container img');
    const loadingContainer = document.createElement('div');
    loadingContainer.classList.add('loading-container');
    loadingContainer.innerHTML = `
      <div class="loader">Loading...</div>
    `;
    document.body.append(loadingContainer);

    fetch(`https://api.themoviedb.org/3/search/movie?api_key=37ca2e4ab22a44443a91eaba5ea3964f&query=${title}`)
      .then(response => response.json())
      .then(data => {
        const movie = data.results[0]; // Assuming the first result is the correct one

        fetch(`https://api.themoviedb.org/3/movie/${movie.id}?api_key=37ca2e4ab22a44443a91eaba5ea3964f`)
          .then(response => response.json())
          .then(detailedData => {
            // Update page with retrieved movie information
            updatePageWithData(movie, detailedData);

            // Save data to local storage with timestamp
            const dataToCache = {
              movie: movie,
              detailedData: detailedData,
              timestamp: Date.now()
            };
            localStorage.setItem(localStorageKey, JSON.stringify(dataToCache));

            loadingContainer.remove(); // Remove loading indicator
          });
      });
  }

  function updatePageWithData(movie, detailedData) {
    document.querySelector('.movie-title').textContent = movie.title;
    const backdropImg = document.querySelector('header img');
    backdropImg.src = `https://image.tmdb.org/t/p/w500${movie.backdrop_path}`;
    const posterImg = document.querySelector('.poster-container img');
    posterImg.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;

    // Populate other sections with data
    const genre = document.querySelector('.genre');
    genre.textContent = detailedData.genres.map(genre => genre.name).join(', ');

    const runtime = document.querySelector('.runtime');
    runtime.textContent = `${detailedData.runtime} minutes`;

    const releaseDate = document.querySelector('.release-date');
    releaseDate.textContent = detailedData.release_date;

    const synopsis = document.querySelector('.synopsis');
    synopsis.textContent = detailedData.overview;

    // Populate ratings section
    const ratingsContainer = document.querySelector('.ratings');
    const averageRating = detailedData.vote_average;
    const roundedAverage = Math.round(averageRating * 2) / 2;
    const starCount = Math.floor(roundedAverage);
    const halfStar = roundedAverage % 1 > 0;

    ratingsContainer.innerHTML = `
      <h2>Ratings</h2>
      <div class="star-rating">
        ${Array(starCount).fill().map(() => '<i class="fa-solid fa-star"></i>').join('')}
        ${halfStar ? '<i class="fa-solid fa-star-half"></i>' : ''}
      </div>
      <p class="average-rating">${averageRating}/10</p>
    `;
  }
  

  // ... your existing code for fetching and displaying movie data ...

  // Get a reference to the play button element
  const playButton = document.querySelector('.play-button');

  // Save the title to the play button's data attribute
  playButton.dataset.title = title;

  playButton.addEventListener('click', () => {
    const savedTitle = playButton.dataset.title;

    // Fetch and parse all JSON files
    Promise.all([
      fetch('movies.json').then(response => response.json()),
      fetch('nollywood.json').then(response => response.json()),
      fetch('animation.json').then(response => response.json())
    ]).then(([moviesData, nollywoodData, animationData]) => {
      const allMovies = [...moviesData.movies, ...nollywoodData.nollywoodFilms, ...animationData.cartoons];

      // Find the exact match for the saved title
      const matchingMovie = allMovies.find(movie => movie.title === savedTitle);

      if (matchingMovie) {
        const vidmolyLink = matchingMovie.vidmolyLink;
        window.location.href = `player.html?vidmolyLink=${vidmolyLink}`;
      } else {
        // Handle the case where no matching movie is found
        console.error('No matching movie found:', savedTitle);
        // You can display an error message to the user here
      }
    });
  });

          
        });










