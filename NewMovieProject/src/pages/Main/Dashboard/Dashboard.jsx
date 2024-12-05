import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [availableMovies, setAvailableMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);

  useEffect(() => {
    const fetchAvailableMovies = async () => {
      try {
        const response = await axios.get(
          'https://api.themoviedb.org/3/movie/popular?language=en-US&page=1',
          {
            headers: {
              Accept: 'application/json',
              Authorization:
               'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5M2Q4YTQwMGVlMzFkMzQ4MGYzNjdlMjk2OGMzODhhZSIsIm5iZiI6MTczMzE1MTAyNS4yNTQwMDAyLCJzdWIiOiI2NzRkYzkzMTc0NzM3NzhiYmQ5YWY3YzUiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.4wKA26LOjYKY3fGsk-zmp0YOvGr7YPfi_IWUf6W7MSE',
            },
          }
        );
        const topMovies = response.data.results
          .sort((a, b) => b.popularity - a.popularity)
          .slice(0, 10);
        setAvailableMovies(topMovies);
      } catch (error) {
        console.error('Error fetching available movies:', error);
      }
    };

    fetchAvailableMovies();
  }, []);

  const handleSelectMovie = (movie) => {
    setSelectedMovie(movie);
    window.scrollTo(0, 0);
  };

  return (
    <div className="dashboard">
      <div className="header">
        <button onClick={() => navigate('/main/movies/lists')} className="navigate-button">
          Movies
        </button>
        
      </div>
  
      {selectedMovie && (
        <div className="selected-movie">
          <h2>Movie Details</h2>
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
  
      <div className="movies-container">
        <h1>Available Movies</h1>
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
    </div>
  );
};

export default Dashboard;