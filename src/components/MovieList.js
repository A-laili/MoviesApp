import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MovieList = (props) => {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [userCountry, setUserCountry] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    
  }, []);

  useEffect(() => {
    if (userCountry) {
      fetchMoviesByCountry(userCountry);
    }
  }, [userCountry]);

  const getUserCountry = async () => {
    try {
      console.log('Getting user country...');
      if (navigator.geolocation) {
        console.log('Geolocation supported. Fetching current position...');
        navigator.geolocation.getCurrentPosition(async (position) => {
          console.log('Current position fetched:', position.coords);
          const { latitude, longitude } = position.coords;
          console.log('Latitude:', latitude, 'Longitude:', longitude);
          console.log('Fetching country from location...');
          const country = await getCountryFromLocation(latitude, longitude);
          console.log('User country:', country);
          setUserCountry(country);
        });
      } else {
        setErrorMsg('Geolocation is not supported by this browser.');
      }
    } catch (error) {
      console.error('Error getting user country:', error);
      setErrorMsg('Error getting user country: ' + error.message);
    }
  };

  const getCountryFromLocation = async (latitude, longitude) => {
    try {
      console.log('Fetching country from location:', latitude, longitude);
      const response = await axios.get(`https://api.opencagedata.com/geocode/v1/json?q=${latitude},${longitude}&key=2de1c3f556354322b312077954676795`);
      console.log('Location data response:', response.data);
      const country = response.data.results[0].components.country;
      console.log('Country:', country);
      return country;
    } catch (error) {
      console.error('Error getting country from location:', error);
      throw new Error('Error getting country from location: ' + error.message);
    }
  };

  const fetchMoviesByCountry = async (country) => {
    try {
      const response = await axios.get('https://api.themoviedb.org/3/discover/movie', {
        params: {
          api_key: '00e58447b107bbf5456c351874f74894',
          region: country,
        },
      });
      setMovies(response.data.results);
      
    } catch (error) {
      console.error('Error fetching movies by country:', error);
    }
  };

  const handleClick = async (movie) => {
    try {
      const detailsResponse = await fetchMovieDetails(movie.id);
      const trailerId = await fetchMovieTrailer(movie.id);
      setSelectedMovie({ ...detailsResponse, trailer: trailerId });
    } catch (error) {
      console.error('Error fetching movie details and trailer:', error);
    }
  };
  

  const fetchMovieDetails = async (movieId) => {
    try {
      const response = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}`, {
        params: {
          api_key: '00e58447b107bbf5456c351874f74894',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching movie details:', error);
      return null;
    }
  };

  const fetchMovieTrailer = async (movieId) => {
    try {
      const response = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}/videos`, {
        params: {
          api_key: '00e58447b107bbf5456c351874f74894',
        },
      });
      return response.data.results[0].key;
    } catch (error) {
      console.error('Error fetching movie trailer:', error);
      return null;
    }
  };

  
  const FavouriteComponent = props.favouriteComponent;

  return (
    <>
     <button onClick={getUserCountry}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-film" viewBox="0 0 16 16">
  <path d="M0 1a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1zm4 0v6h8V1zm8 8H4v6h8zM1 1v2h2V1zm2 3H1v2h2zM1 7v2h2V7zm2 3H1v2h2zm-2 3v2h2v-2zM15 1h-2v2h2zm-2 3v2h2V4zm2 3h-2v2h2zm-2 3v2h2v-2zm2 3h-2v2h2z"/>
</svg></button>
{props.movies.map((movie, index) => (
      <div className='image-container d-flex justify-content-start m-3'>
        
        <img src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`} alt='movie' onClick={() => handleClick(movie)} />
          
        <div
          onClick={() => props.handleFavouritesClick(movie)}
          className='overlay d-flex align-items-center justify-content-center'
        >
          <FavouriteComponent />
        </div>
        
      </div>
    ))}
     
      {movies.map((movie, index) => (
        <div className='image-container d-flex justify-content-start m-3' key={index}>
          <img src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`} alt='movie' onClick={() => handleClick(movie)} />
          
          <div onClick={() => props.handleFavouritesClick(movie)} className='overlay d-flex align-items-center justify-content-center'>
            <FavouriteComponent />
          </div>
        </div>
      ))}
      {selectedMovie && (
        <div className='image-container d-flex justify-content-start m-3'>
          <div className='selected-movie-details'>
            <div className='movie-info'>
              <img src={`https://image.tmdb.org/t/p/w500/${selectedMovie.poster_path}`} alt='selected movie poster' />
              <div>
                <h2>{selectedMovie.title}</h2>
                <p>{selectedMovie.description}</p>
              </div>
            </div>
            <div className='trailer-container'>
              <iframe
                width='560'
                height='315'
                src={`https://www.youtube.com/embed/${selectedMovie.trailer}`}
                title='YouTube video player'
                frameBorder='0'
                allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MovieList;
