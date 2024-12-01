import { useNavigate } from 'react-router-dom';
import './Home.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import MovieCards from '../../../../components/MovieCards/MovieCards';
import { useMovieContext } from '../../../../context/MovieContext';

const Home = () => {
  const navigate = useNavigate();
  const [featuredMovie, setFeaturedMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const { movieList, setMovieList, setMovie } = useMovieContext();

  const getMovies = async () => {
    try {
      const response = await axios.get('/movies');
      setMovieList(response.data);
      const randomIndex = Math.floor(Math.random() * response.data.length);
      setFeaturedMovie(response.data[randomIndex]);
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMovies();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (movieList.length) {
        const randomIndex = Math.floor(Math.random() * movieList.length);
        setFeaturedMovie(movieList[randomIndex]);
      }
    }, 5000);

    return () => clearInterval(interval); 
  }, [movieList]);

  return (
    <div className='main-container'>
      <h1 className='page-title'>Movies</h1>
      {loading ? (
        <div className='loading-indicator'>Loading...</div> 
      ) : featuredMovie && movieList.length ? (
        <div className='featured-list-container'>
          <div
            className='featured-backdrop'
            style={{
              background: `url(${
                featuredMovie.backdropPath !==
                'https://image.tmdb.org/t/p/original/undefined'
                  ? featuredMovie.backdropPath
                  : featuredMovie.posterPath
              }) no-repeat center top`,
            }}
          >
            <span className='featured-movie-title'>{featuredMovie.title}</span>
          </div>
        </div>
      ) : (
        <div className='featured-list-container-loader'>No movies available</div>
      )}
      <div className='list-container'>
        {movieList.map((movie) => (
          <MovieCards
            key={movie.id} 
            movie={movie}
            onClick={() => {
              navigate(`/view/${movie.id}`);
              setMovie(movie);
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;