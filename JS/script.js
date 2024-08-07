$(document).ready(function () {
    localStorage.clear();
    const apiKey = "1f908df6e080074acf5a2bb1d5b1d233";
    const apiEndpoint = "https://api.themoviedb.org/3/movie/now_playing";
    const movieSearchEl = $("#movieSearchText");
    const currentMovieEl = $("#currentMovieEl");
    let buttons = [];
  
    const getNowPlayingMovies = async () => {
      try {
        const response = await fetch(`${apiEndpoint}?api_key=${apiKey}`, {
          headers: {
            Accept: "application/json",
          },
        });
        if (!response.ok) {
          throw new Error("There was an error when fetching");
        }
        const data = await response.json();
        processMovieData(data);
      } catch (error) {
        console.error("Error fetching now playing movies", error);
      }
    };
  
    const processMovieData = (data) => {
      const movieContainer = document.getElementById("movieContainer");
      movieContainer.innerHTML = "";
  
      data.results.slice(0, 10).forEach(movie => {
        const movieCard = createMovieCard(movie);
        movieContainer.appendChild(movieCard);
      });
    };
  
    const createMovieCard = (movie) => {
      const movieCard = document.createElement("div");
      movieCard.classList.add("movie-card");
  
      const movieImage = document.createElement("img");
      movieImage.setAttribute("src", `https://image.tmdb.org/t/p/w200${movie.poster_path}`);
      movieCard.appendChild(movieImage);
  
      const movieName = document.createElement("h2");
      movieName.textContent = movie.title;
      movieCard.appendChild(movieName);
  
      const movieRating = document.createElement("p");
      movieRating.textContent = `Rating: ${movie.vote_average} %`;
      movieCard.appendChild(movieRating);
  
      return movieCard;
    };
  
    const searchSubmit = (event) => {
      event.preventDefault();
  
      const movieInput = movieSearchEl.val();
      currentMovieEl.text(movieInput);
  
      const savedButton = createButton(movieInput);
      document.getElementById("history").appendChild(savedButton);
  
      buttons.push(movieInput);
      saveButtonsToLocalStorage();
  
      getMoviePlot(movieInput);
    };
  
      const createButton = (buttonText) => {
      const button = document.createElement("button");
      button.textContent = buttonText;
      button.classList.add("history-button");
      button.addEventListener("click", () => {
        movieSearchEl.val(buttonText);
        getMoviePlot(buttonText);
      });
      return button;
    };
  
    const saveButtonsToLocalStorage = () => {
      localStorage.setItem("buttons", JSON.stringify(buttons));
    };
  
    const getMoviePlot = async (title) => {
      const moviePlotUrl = `https://www.omdbapi.com/?apikey=d9732be9&t=${title}&plot=full`;
      const theaterContainer = $("#search-results");
      try {
        const response = await fetch(moviePlotUrl);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        const plot = data.Plot || "Plot not available";
        theaterContainer.text(plot);
      } catch (error) {
        theaterContainer.text("Failed to fetch movie plot");
        console.error("There was a problem fetching data", error);
      }
    };
  
    $("form").on("submit", searchSubmit);
  
    getNowPlayingMovies();
  });