const searchInput = document.getElementById('search-movie');
const movieContainer = document.getElementById('movie-container');
const paginationContainer = document.getElementById('pagination-container');

const Api_Key = '6cb964bf';
const Base_Url = `http://www.omdbapi.com/?i=tt3896198&apikey=${Api_Key}`;

const debounce = (fn, delay) => {
    let timer;
    return function () {
        timer && clearTimeout(timer);
        timer = setTimeout(() => {
            fn();
        }, delay);
    };
};

async function fetchMovie(page = 1) {
    const response = await fetch(`${Base_Url}&s=${searchInput.value}&page=${page}`);
    const data = await response.json();
    const { Response, Search, totalResults } = data;
    Response === "False" ? responseIsFalse() : displayMoviesContainer(Search, totalResults, page);
    console.log(data);
}

const debounceFunction = debounce(fetchMovie, 1000);

searchInput.addEventListener('input', debounceFunction);

function responseIsFalse() {
    movieContainer.innerHTML = `<h2 class="no-movies">No movies were found for your search input "${searchInput.value}"</h2>`;
    paginationContainer.innerHTML = ""; // Clear pagination if no results found
}

function displayMoviesContainer(Search, totalResults, page) {
    movieContainer.innerHTML = "";
    Search.forEach((movie) => {
        const card = createCard(movie);
        movieContainer.appendChild(card);
    });
    displayPagination(totalResults, page);
}

const createCard = (movie) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
    <img src="${movie.Poster}" class="card-img-top" alt="...">
    <div class="card-body">
    <h3>${movie.Title}</h3>
    <p>${movie.Year}</p>
    </div>`;
    return card;
};

const displayPagination = (totalResults, currentpage) => {
    const totalPages = Math.ceil(totalResults / 10);
    paginationContainer.innerHTML = `
    <button ${currentpage === 1 ? "disabled" : ""} onclick="fetchMovie(${currentpage - 1})">Previous</button>
    <span>${currentpage} of ${totalPages}</span>
    <button ${currentpage === totalPages ? "disabled" : ""} onclick="fetchMovie(${currentpage + 1})">Next</button>`;
};

let currentpage = 1;
