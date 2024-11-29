import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Form.css';

const Form = () => {
  const [movie, setMovie] = useState({
    title: '',
    overview: '',
    popularity: '',
    releaseDate: '',
    voteAverage: '',
    backdropPath: '',
    posterPath: '',
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  let { movieId } = useParams();
  const accessToken = localStorage.getItem('accessToken');

  const handleSave = async () => {
    if (!validateForm()) return; 

    const data = {
      tmdbId: movie.tmdbId || null,
      title: movie.title,
      overview: movie.overview,
      popularity: movie.popularity,
      releaseDate: movie.releaseDate,
      voteAverage: movie.voteAverage,
      backdropPath: movie.backdropPath,
      posterPath: movie.posterPath,
      isFeatured: movie.isFeatured ? 1 : 0,
    };

    try {
      const response = await axios.post('/movies', data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log('Response from API:', response.data);
      alert('Movie added successfully');

     
      setMovie({
        title: '',
        overview: '',
        popularity: '',
        releaseDate: '',
        voteAverage: '',
        backdropPath: '',
        posterPath: '',
      });
    } catch (error) {
      console.error('Error saving movie:', error.response ? error.response.data : error.message);
      alert('Failed to add movie. Please try again.');
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
      [name ]: '', 
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!movie.title?.trim()) newErrors.title = 'Title is required';
    if (!movie.overview?.trim()) newErrors.overview = 'Overview is required';
    if (!movie.releaseDate) newErrors.releaseDate = 'Release date is required';
    setErrors(newErrors);
    console.log('Validation errors:', newErrors); 
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
      console.log('Update response:', response.data);
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
        console.log('Fetched movie data:', response.data);
      }).catch((error) => {
        console.error('Error fetching movie details:', error);
      });
    }
  }, [movieId]);

  return (
    <>
      <h1>{movieId ? 'Edit' : 'Create'} Movie</h1>

      <hr />
      <div className='movie-container'>
        <form>
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