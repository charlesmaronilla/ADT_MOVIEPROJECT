import { useEffect } from 'react';
import { useMovieContext } from '../../../../context/MovieContext';
import { useNavigate, useParams } from 'react-router-dom';
import './View.css';
import axios from 'axios';

function View() {
  const { movie, setMovie } = useMovieContext();
  const { movieId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (movieId) {
      axios
        .get(`/movies/${movieId}`)
        .then((response) => {
          setMovie(response.data);
        })
        .catch((e) => {
          console.error(e);
          navigate('/'); 
        });
    }
  }, [movieId, setMovie, navigate]); 

  return (
    <>
      {movie && (
        <div>
          <div className='banner'>
            <h1>{movie.title}</h1>
          </div>
          <h3>{movie.overview}</h3>
          

          {movie.casts && movie.casts.length > 0 && (
            <div>
              <h1>Cast & Crew</h1>
              <ul>
                {movie.casts.map((cast) => (
                  <li key={cast.id}>
                    <div>
                      <h3>{cast.characterName}</h3>
                      <p>{cast.name}</p>
                      <img
                        src={cast.url}
                        alt={cast.name}
                        style={{ maxWidth: '200px', height: 'auto' }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {movie.videos && movie.videos.length > 0 && (
            <div>
              <h1>Videos</h1>
              <ul>
                {movie.videos.map((video) => (
                  <li key={video.id}>
                    <div>
                      <h3>{video.name}</h3>
                      <iframe
                        width="560"
                        height="315"
                        src={video.url}
                        title={video.name}
                        frameBorder="0"
                        allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {movie.photos && movie.photos.length > 0 && (
            <div>
              <h1>Photos</h1>
              <div className='photo-gallery'>
                {movie.photos.map((photo) => (
                  <img
                    key={photo.id}
                    src={photo.url}
                    alt={photo.description}
                    style={{ maxWidth: '200px', height: 'auto', margin: '5px' }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default View;