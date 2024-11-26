import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Form.css';

const Form = () => {
  const [query, setQuery] = useState('');
  const [searchedMovieList, setSearchedMovieList] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(undefined);
  const [movie, setMovie] = useState({});
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  let { movieId } = useParams();
  const accessToken = localStorage.getItem('accessToken');

  const handleSearch = useCallback(() => {
    axios({
      method: 'get',
      url: `https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=en-US&page=1`,
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5YTdiNmUyNGJkNWRkNjhiNmE1ZWFjZjgyNWY3NGY5ZCIsIm5iZiI6MTcyOTI5NzI5Ny4wNzMzNTEsInN1YiI6IjY2MzhlZGM0MmZhZjRkMDEzMGM2NzM3NyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ZIX4EF2yAKl6NwhcmhZucxSQi1rJDZiGG80tDd6_9XI',
      },
    }).then((response) => {
      setSearchedMovieList(response.data.results);
      console.log(response.data.results);
    });
  }, [query]);

  const handleSelectMovie = (movie) => {
    setSelectedMovie(movie);
    setMovie({
      tmdbId: movie.id,
      title: movie.original_title,
      overview: movie.overview,
      popularity: movie.popularity,
      releaseDate: movie.release_date,
      voteAverage: movie.vote_average,
      backdropPath: movie.backdrop_path,
      posterPath: movie.poster_path,
    });
  };

  const handleSave = async () => {
    if (!selectedMovie) {
      alert('Please search and select a movie.');
      return;
    }

    const data = {
      tmdbId: selectedMovie.id,
      title: selectedMovie.original_title,
      overview: selectedMovie.overview,
      popularity: selectedMovie.popularity,
      releaseDate: selectedMovie.release_date,
      voteAverage: selectedMovie.vote_average,
      backdropPath: `https://image.tmdb.org/t/p/original/${selectedMovie.backdrop_path}`,
      posterPath: `https://image.tmdb.org/t/p/original/${selectedMovie.poster_path}`,
      isFeatured: selectedMovie.isFeatured ? 1 : 0,
    };

    try {
      const response = await axios.post('/movies', data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log(response);
      alert('Success');
      navigate('/main/movies');
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setMovie((prevMovie) => ({
      ...prevMovie,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: '', // Clear the specific field error if it exists
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!movie.title?.trim()) newErrors.title = 'Title is required';
    if (!movie.overview?.trim()) newErrors.overview = 'Overview is required';
    if (!movie.releaseDate) newErrors.releaseDate = 'Release date is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdate = async () => {
    if (!validateForm()) return;

    try {
      const response = await axios.patch(`/movies/${movieId}`, movie, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log(response);
      alert('Movie details updated successfully');
      navigate('/main/movies');
    } catch (error) {
      console.error('Error updating movie details:', error);
      alert('Failed to update movie details. Please try again.');
    }
  };

  useEffect(() => {
    if (movieId) {
      axios.get(`/movies/${movieId}`).then((response) => {
        setMovie(response.data);
        const tempData = {
          id: response.data.tmdbId,
          original_title: response.data.title,
          overview: response.data.overview,
          popularity: response.data.popularity,
          poster_path: response.data.posterPath,
          release_date: response.data.releaseDate,
          vote_average: response.data.voteAverage,
        };
        setSelectedMovie(tempData);
        console.log(response.data);
      });
    }
  }, [movieId]);

  return (
    <>
      <h1>{movieId ? 'Edit' : 'Create'} Movie</h1>

      {movieId === undefined && (
        <>
          <div className='search-container'>
            Search Movie:
            <input type='text' onChange={(e) => setQuery(e.target.value)} />
            <button type='button' onClick={handleSearch}>
              Search
            </button>
            <div className='searched-movie'>
              {searchedMovieList.map((movie) => (
                <p key={movie.id} onClick={() => handleSelectMovie(movie)}>
                  {movie.original_title}
                </p>
              ))}
            </div>
          </div>
        </>
      )}
      <hr />
      <div className='movie-container'>
        <form>
          {selectedMovie && (
            <img
              className='poster-image'
              src={`https://image.tmdb.org/t/p/original/${selectedMovie.poster_path}`}
              alt={selectedMovie.original_title}
            />
          )}
          <div className='field'>
            Title:
            <input
              type='text'
              name='title'
              value={movie.title || ''}
              onChange={handleChange}
            />
            {errors.title && <span className='error'>{errors.title}</span>}
          </div>
          <div className='field'>
            Overview:
            <textarea
              rows={10}
              name='overview'
              value={movie.overview || ''}
              onChange={handleChange}
            />
            {errors.overview && <span className='error'>{errors.overview}</span>}
          </div>

          <div className='field'>
            Popularity:
            <input
              type='text'
              name='popularity'
              value={movie.popularity || ''}
              onChange={handleChange}
            />
          </div>

          <div className='field'>
            Release Date:
            <input
              type='text'
              name='releaseDate'
              value={movie.releaseDate || ''}
              onChange={handleChange}
            />
            {errors.releaseDate && <span className='error'>{errors.releaseDate}</span>}
          </div>

          <div className='field'>
            Vote Average:
            <input
              type='text'
              name='voteAverage'
              value={movie.voteAverage || ''}
              onChange={handleChange}
            />
          </div>

          <div className='butt'>
            <button type='button' onClick={handleSave}>
              Save
            </button>
            <button type='button' onClick={handleUpdate}>
              Update
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Form;
