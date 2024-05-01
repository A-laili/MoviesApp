import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MovieList = (props) => {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [userCountry, setUserCountry] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [moviesInUserCountry, setMoviesInUserCountry] = useState([]);

  useEffect(() => {
    if (userCountry) {
      const filteredMovies = props.movies.filter(movie => movie.Country && movie.Country.includes(userCountry));
      setMoviesInUserCountry(filteredMovies);
    }
  }, [userCountry, props.movies]);

  const handleClick = async (movie) => {
    try {
      const detailsResponse = await fetchMovieDetails(movie.Title);
      const trailerId = await fetchMovieTrailer(movie.Title);
      setSelectedMovie({ ...movie, description: detailsResponse.Plot, trailer: trailerId });
    } catch (error) {
      console.error('Error fetching movie details and trailer:', error);
    }
  };

  const fetchMovieDetails = async (movieTitle) => {
    try {
      const response = await axios.get(`http://www.omdbapi.com/?t=${movieTitle}&apikey=70c47435`);
      return response.data;
    } catch (error) {
      console.error('Error fetching movie details:', error);
      return null;
    }
  };

  const fetchMovieTrailer = async (movieTitle) => {
    try {
      const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
        params: {
          q: `${movieTitle} trailer`,
          part: 'snippet',
          maxResults: 1,
          type: 'video',
          key: 'AIzaSyB0JWfa-UI4fXgayxvo4KFgDj6BU7WUlbw'
        }
      });
      return response.data.items[0].id.videoId;
    } catch (error) {
      console.error('Error fetching movie trailer:', error);
      return null;
    }
  };

  const getUserCountry = async () => {
    try {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
          const { latitude, longitude } = position.coords;
          const country = await getCountryFromLocation(latitude, longitude);
          setUserCountry(country);
          const filteredMovies = props.movies.filter(movie => movie.Country && movie.Country.includes(country));
          setMoviesInUserCountry(filteredMovies);
        });
      } else {
        setErrorMsg('Geolocation is not supported by this browser.');
      }
    } catch (error) {
      setErrorMsg('Error getting user country: ' + error.message);
    }
  };
  

  const getCountryFromLocation = async (latitude, longitude) => {
    try {
      const response = await axios.get(`https://api.opencagedata.com/geocode/v1/json?q=${latitude},${longitude}&key=2de1c3f556354322b312077954676795`);
      return response.data.results[0].components.country;
    } catch (error) {
      throw new Error('Error getting country from location: ' + error.message);