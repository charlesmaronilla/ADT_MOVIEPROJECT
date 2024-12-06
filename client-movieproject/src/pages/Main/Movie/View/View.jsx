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
    <div className="view-container">
      {movie && (
        <>
          <div className="banner">
            <h1>{movie.title}</h1>
          </div>
          <p className="movie-overview">{movie.overview}</p>

          {movie.casts && movie.casts.length > 0 && (
            <div className="section">
              <h2>Cast & Crew</h2>
              <div className="card-grid">
                {movie.casts.map((cast) => (
                  <div key={cast.id} className="card">
                    <img src={cast.url} alt={cast.name} />
                    <div className="card-content">
                      <h3 className="card-title">{cast.characterName}</h3>
                      <p className="card-description">{cast.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {movie.videos && movie.videos.length > 0 && (
            <div className="section">
              <h2>Videos</h2>
              <div className="video-grid">
                {movie.videos.map((video) => (
                  <div key={video.id} className="video-card">
                    <h3 className="video-title">{video.name}</h3>
                    <iframe
                      width="100%"
                      height="200"
                      src={video.url}
                      title={video.name}
                      frameBorder="0"
                      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                ))}
              </div>
            </div>
          )}

          {movie.photos && movie.photos.length > 0 && (
            <div className="section">
              <h2>Photos</h2>
              <div className="photo-gallery">
                {movie.photos.map((photo) => (
                  <img
                    key={photo.id}
                    src={photo.url}
                    alt={photo.description}
                    className="gallery-photo"
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default View;
