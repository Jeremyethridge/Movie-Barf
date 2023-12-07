var movieSearchEl = $('#movieSearchText');
var currentMovieEl = $('#currentMovieEl');
var movieInput = movieSearchEl.val();
var buttons = [];
var para = document.createElement('p');


$(document).ready(function() {

// API Call to get Now Playing Movies from the Movie DB database
function getNowPlayingMovies() {
    var apiKey = '1f908df6e080074acf5a2bb1d5b1d233';
    var apiEndpoint = 'https://api.themoviedb.org/3/movie/now_playing';

    fetch(apiEndpoint + '?api_key=' + apiKey, {
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        processMovieData(data);
    })
    .catch(function(error) {
        console.error('Error fetching now playing movies', error);
    });
}

// Processes the API call data into dynamic posters to show i posters
function processMovieData(data) {
    
        for (var i = 0; i < 10; i++) {
            var movieContainer = document.getElementById('movieContainer');
            var movieCard = document.createElement('div');
            
            movieCard.classList.add('movie-card');
            movieContainer.appendChild(movieCard);

            var movieImage = document.createElement('img');
            movieImage.setAttribute('src', 'https://image.tmdb.org/t/p/w200' + data.results[i].poster_path);
            movieCard.appendChild(movieImage);

            var movieName = document.createElement('h2');
            movieName.textContent = data.results[i].title;
            movieCard.appendChild(movieName);

            var extension = document.createElement('p');
            extension.textContent = 'Rating: ' + data.results[i].vote_average + " %";
            movieCard.appendChild(extension);
  
        }
      };

// JS Section to initialize form submittal and drive search function to variable storage.

var searchSubmit = function (event) {
    event.preventDefault();

    var movieInput = movieSearchEl.val();
    currentMovieEl.text(movieInput);
    // Add dynamic button creation with each search with btn functionality to be searched
    var savedButton = document.createElement('button');
    savedButton.classList.add('history-button');
    savedButton.textContent = movieInput;

    //Reloads input text
    savedButton.addEventListener('click', function() {
        document.getElementById('movieSearchText').value = movieInput;
    });

    //Saves buttons to array
    buttons.push(movieInput);
    saveButtonsToLocalStorage();

    var para = document.createElement('p');
    para.appendChild(savedButton);
    document.getElementById('history').appendChild(para);

    document.getElementById('history').appendChild(savedButton);
    document.getElementById('history').appendChild(para);
    
    getMoviePlot(movieInput); 
};

// Loads buttons from LocalStorage from previous searches
function loadButtonsFromLocalStorage() {
    var savedButtons = localStorage.getItem('buttons');
    e.preventDefault();

    if (savedButtons) {
        buttons = JSON.parse(savedButtons);
        buttons.forEach(function(buttonText) {
            var button = document.createElement('button');
            button.textContent = buttonText;
            button.classList.add('history-button');
            button.addEventListener('click', function() {
                console.log(this);
                var buttonText = this.innerHTML;
                getMoviePlot(buttonText); 
            });
            var para = document.createElement('p');
            para.appendChild(button);
            document.getElementById('history').appendChild(para);
        });
    }
};

// Saves previous searches to LocalStorage
function saveButtonsToLocalStorage (){
    localStorage.setItem('buttons', JSON.stringify(buttons));
};

// API call to get movie plot from OMDB, based on search or by clicking saved history button
function getMoviePlot(title) {
    var moviePlotUrl = `https://www.omdbapi.com/?apikey=d9732be9&t=${title}&plot=full`;
    var theaterContainer = $('#search-results');

    fetch(moviePlotUrl, {
        
    })
        .then(function(response) {
            return response.json();
                
        })
        .then(function(data) {
            var results = data["Plot"];
            theaterContainer.text(results);
        });
}; 

document.querySelector('form').addEventListener('submit', searchSubmit);

getNowPlayingMovies();
loadButtonsFromLocalStorage();

});