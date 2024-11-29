import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate(); 
  const [query, setQuery] = useState('');
  const [searchedMovieList, setSearchedMovieList] = useState([]);
  const [availableMovies, setAvailableMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);

 
  useEffect(() => {
    const fetchAvailableMovies = async () => {
      try {
        const response = await axios.get(
          'https://api.themoviedb.org/3/movie/popular?language=en-US&page=1', {
            headers: {
              Accept: 'application/json',
              Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5YTdiNmUyNGJkNWRkNjhiNmE1ZWFjZjgyNWY3NGY5ZCIsIm5iZiI6MTcyOTI5NzI5Ny4wNzMzNTEsInN1YiI6IjY2MzhlZGM0MmZhZjRkMDEzMGM2NzM3NyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ZIX4EF2yAKl6NwhcmhZucxSQi1rJDZiGG80tDd6_9XI',
            },
          }
        );
        const topMovies = response.data.results.sort((a, b) => b.popularity - a.popularity).slice(0, 10);
        setAvailableMovies(topMovies);
      } catch (error) {
        console.error('Error fetching available movies:', error);
      }
    };

    fetchAvailableMovies();
  }, []);

  
  const handleSearch = useCallback(() => {
    if (!query) return;
    axios({
      method: 'get',
      url: `https://api.themoviedb.org/3/ search/movie?query=${query}&include_adult=false&language=en-US&page=1`,
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5YTdiNmUyNGJkNWRkNjhiNmE1ZWFjZjgyNWY3NGY5ZCIsIm5iZiI6MTcyOTI5NzI5Ny4wNzMzNTEsInN1YiI6IjY2MzhlZGM0MmZhZjRkMDEzMGM2NzM3NyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ZIX4EF2yAKl6NwhcmhZucxSQi1rJDZiGG80tDd6_9XI',
      },
    }).then((response) => {
      setSearchedMovieList(response.data.results);
    }).catch((error) => {
      console.error('Error searching for movies:', error);
    });
  }, [query]);

  
  const handleSelectMovie = (movie) => {
    setSelectedMovie(movie);
    window.scrollTo(0, 0);
  };

  return (
    <div className="dashboard">
      <h1>Admin Dashboard</h1>

     
      <button onClick={() => navigate('/main/movies/lists')} className="navigate-button">
        Go to Movie Lists
      </button>

      {selectedMovie && (
        <div className="selected-movie">
          <h2> Selected Movie Details</h2>
          <img
            className="poster-image"
            src={`https://image.tmdb.org/t/p/original/${selectedMovie.poster_path}`}
            alt={selectedMovie.original_title}
          />
          <p><strong>Title:</strong> {selectedMovie.original_title}</p>
          <p><strong>Overview:</strong> {selectedMovie.overview}</p>
          <p><strong>Release Date:</strong> {selectedMovie.release_date}</p>
          <p><strong>Vote Average:</strong> {selectedMovie.vote_average}</p>
        </div>
      )}

      <div className="search-container">
        <input
          type="text"
          placeholder="Search Movies..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      <div className="movies-container">
        <h2>Top 10 Movies</h2>
        <div className="movies-grid">
          {availableMovies.map((movie) => (
            <div
              key={movie.id}
              className="movie-item"
              onClick={() => handleSelectMovie(movie)}
            >
              <img
                src={`https://image.tmdb.org/t/p/w200/${movie.poster_path}`}
                alt={movie.original_title}
                className="movie-poster"
              />
              <h3>{movie.original_title}</h3>
            </div>
          ))}
        </div>
      </div>

      <div className="searched-movies-container">
        <h2>Searched Movies</h2>
        <div className="movies-grid">
          {searchedMovieList.map((movie) => (
            <div
              key={movie.id}
              className="movie-item"
              onClick={() => handleSelectMovie(movie)}
            >
              <img
                src={`https://image.tmdb.org/t/p/w200/${movie.poster_path}`}
                alt={movie.original_title}
                className="movie-poster"
              />
              <h3>{movie.original_title}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;