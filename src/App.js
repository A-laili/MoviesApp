import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import MovieList from './components/MovieList';
import MovieListHeading from './components/MovieListHeading';
import SearchBox from './components/SearchBox';
import AddFavourites from './components/AddFavourites';
import RemoveFavourites from './components/RemoveFavourites';

const App = () => {
    const [movies, setMovies] = useState([]);
    const [favourites, setFavourites] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const [selectedMovie, setSelectedMovie] = useState(null); // New state to store the selected movie

    const getMovieRequest = async (searchValue) => {
        const url = `https://api.themoviedb.org/3/search/movie?api_key=00e58447b107bbf5456c351874f74894&query=${searchValue}`;

        try {
            const response = await fetch(url);
            const data = await response.json();
            if (data.results) {
                setMovies(data.results);
            }
        } catch (error) {
            console.error('Error fetching movies:', error);
        }
    };

    useEffect(() => {
        getMovieRequest(searchValue);
    }, [searchValue]);

    useEffect(() => {
        const movieFavourites = JSON.parse(localStorage.getItem('react-movie-app-favourites'));

        if (movieFavourites) {
            setFavourites(movieFavourites);
        }
    }, []);

    const saveToLocalStorage = (items) => {
        localStorage.setItem('react-movie-app-favourites', JSON.stringify(items));
    };

    const addFavouriteMovie = (movie) => {
        const isAlreadyAdded = favourites.some((fav) => fav.id === movie.id);

        if (!isAlreadyAdded) {
            const newFavouriteList = [...favourites, movie];
            setFavourites(newFavouriteList);
            saveToLocalStorage(newFavouriteList);
        }
    };

    const removeFavouriteMovie = (movie) => {
        const newFavouriteList = favourites.filter((favourite) => favourite.id !== movie.id);

        setFavourites(newFavouriteList);
        saveToLocalStorage(newFavouriteList);
    };

    const handleMovieClick = (movie) => {
        setSelectedMovie(movie); // Set the selected movie when clicked
    };

    return (
        <div className='container-fluid movie-app'>
            <div className='row d-flex align-items-center mt-4 mb-4'>
                <MovieListHeading heading='Movies' />
                <SearchBox searchValue={searchValue} setSearchValue={setSearchValue} />
            </div>
            <div className='row'>
                <MovieList
                    movies={movies}
                    handleFavouritesClick={addFavouriteMovie} // Pass the addFavouriteMovie function here
                    favouriteComponent={AddFavourites}
                    handleMovieClick={handleMovieClick} // Pass the handleMovieClick function here
                />
                {selectedMovie && ( // Display selected movie details and trailer if a movie is selected
                    <div className='col-md-6'>
                        <div className='selected-movie-details'>
                            <h2>{selectedMovie.title}</h2>
                            <p>{selectedMovie.overview}</p>
                            {/* Include the iframe for the trailer here */}
                        </div>
                    </div>
                )}
            </div>
			
            <div className='row d-flex align-items-center mt-4 mb-4'>
                <MovieListHeading heading='Favourites' />
            </div>
            <div className='row'>
                <MovieList
                    movies={favourites}
                    handleFavouritesClick={removeFavouriteMovie}
                    favouriteComponent={RemoveFavourites}
                />
            </div>
        </div>
    );
};

export default App;
