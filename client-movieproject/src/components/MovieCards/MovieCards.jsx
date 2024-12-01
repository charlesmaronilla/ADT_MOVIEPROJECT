import React from 'react';
import PropTypes from 'prop-types'; 
import './MovieCards.css';

function MovieCards({ movie, onClick }) {
  return (
    <div className='card' onClick={onClick}>
      <img src={movie.posterPath} alt={`${movie.title} poster`} />
      <div className='card-content'> 
        <span className='card-title'>{movie.title}</span> 
      </div>
    </div>
  );
}


MovieCards.propTypes = {
  movie: PropTypes.shape({
    title: PropTypes.string.isRequired,
    posterPath: PropTypes.string.isRequired,
  }).isRequired,
  onClick: PropTypes.func.isRequired,
};

export default MovieCards;