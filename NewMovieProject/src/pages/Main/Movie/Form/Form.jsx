import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Form.css";

const Form = () => {
  const [query, setQuery] = useState("");
  const [searchedMovieList, setSearchedMovieList] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    overview: "",
    popularity: "",
    releaseDate: "",
    voteAverage: "",
    videos: [],
    cast: [],
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [videos, setVideos] = useState([]);
  const [cast, setCast] = useState([]);

  const { movieId } = useParams();
  const navigate = useNavigate();

  const handleSearch = useCallback(() => {
    setError("");
    if (!query.trim()) {
      setError("Please enter a search term");
      return;
    }

    setIsLoading(true);
    setSearchedMovieList([]);

    axios.get(`https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=en-US&page=${currentPage}`, {
      headers: {
        Accept: "application/json",
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5M2Q4YTQwMGVlMzFkMzQ4MGYzNjdlMjk2OGMzODhhZSIsIm5iZiI6MTczMzE1MTAyNS4yNTQwMDAyLCJzdWIiOiI2NzRkYzkzMTc0NzM3NzhiYmQ5YWY3YzUiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.4wKA26LOjYKY3fGsk-zmp0YOvGr7YPfi_IWUf6W7MSE',
      },
    })
      .then((response) => {
        if (response.data.results.length === 0) {
          setError("No movies found matching your search");
        } else {
          setSearchedMovieList(response.data.results);
          setTotalPages(response.data.total_pages);
        }
      })
      .catch(() => {
        setError("Unable to search movies at this time. Please try again later.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [query, currentPage]);

  useEffect(() => {
    if (currentPage > 1) {
      handleSearch();
    }
  }, [currentPage, handleSearch]);

  const handleSelectMovie = (movie) => {
    setSelectedMovie(movie);
    setFormData({
      title: movie.title,
      overview: movie.overview,
      popularity: movie.popularity,
      releaseDate: movie.release_date,
      voteAverage: movie.vote_average,
      videos: [],
      cast: [],
    });
    setError("");

  
    axios.get(`https://api.themoviedb.org/3/movie/${movie.id}/videos?language=en-US`, {
      headers: {
        Accept: "application/json",
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5M2Q4YTQwMGVlMzFkMzQ4MGYzNjdlMjk2OGMzODhhZSIsIm5iZiI6MTczMzE1MTAyNS4yNTQwMDAyLCJzdWIiOiI2NzRkYzkzMTc0NzM3NzhiYmQ5YWY3YzUiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.4wKA26LOjYKY3fGsk-zmp0YOvGr7YPfi_IWUf6W7MSE',
      },
    })
      .then(response => {
        setVideos(response.data.results);
        setFormData(prevData => ({
          ...prevData,
          videos: response.data.results, 
        }));
      })
      .catch(() => {
        setError("Unable to load videos. Please try again later.");
      });


    axios.get(`https://api.themoviedb.org/3/movie/${movie.id}/credits?language=en-US`, {
      headers: {
        Accept: "application/json",
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5M2Q4YTQwMGVlMzFkMzQ4MGYzNjdlMjk2OGMzODhhZSIsIm5iZiI6MTczMzE1MTAyNS4yNTQwMDAyLCJzdWIiOiI2NzRkYzkzMTc0NzM3NzhiYmQ5YWY3YzUiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.4wKA26LOjYKY3fGsk-zmp0YOvGr7YPfi_IWUf6W7MSE',
      },
    })
      .then(response => {
        setCast(response.data.cast);
        setFormData(prevData => ({
          ...prevData,
          cast: response.data.cast,
        }));
      })
      .catch(() => {
        setError("Unable to load cast information. Please try again later.");
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setError("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setCurrentPage(1);
      handleSearch();
    }
  };

  const validateForm = () => {
    const errors = [];
    if (!formData.title) errors.push("Title is required");
    if (!formData.overview) errors.push("Overview is required");
    if (!formData.releaseDate) errors.push("Release date is required");
    if (!formData.popularity) errors.push("Popularity is required");
    if (!formData.voteAverage) errors.push("Vote average is required");
    if (!selectedMovie) errors.push("Please select a movie from search results");
    return errors;
  };

  const handleSave = async () => {
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setError(validationErrors.join(", "));
      return;
    }
  
    setIsLoading(true);
    setError("");
  
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      setError("You must be logged in to perform this action");
      setIsLoading(false);
      return;
    }
  
    const data = {
      tmdbId: selectedMovie.id,
      title: formData.title,
      overview: formData.overview,
      popularity: parseFloat(formData.popularity),
      releaseDate: formData.releaseDate,
      voteAverage: parseFloat(formData.voteAverage),
      backdropPath: `https://image.tmdb.org/t/p/original/${selectedMovie.backdrop_path}`,
      posterPath: `https://image.tmdb.org/t/p/original/${selectedMovie.poster_path}`,
      isFeatured: 0,
      videos: formData.videos,
      cast: formData.cast,
    };
  
    try {
      await axios({
        method: movieId ? "patch" : "post",
        url: movieId ? `/movies/${movieId}` : "/movies",
        data: data,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      alert("Movie saved successfully! Redirecting to the movie list.");
      navigate("/lists");
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Unable to save the movie. Please try again later.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = handleSave;

  useEffect(() => {
    if (movieId) {
      setIsLoading(true);
      setError("");

      axios.get(`/movies/${movieId}`)
        .then((response) => {
          const movieData = response.data;
          setSelectedMovie({
            id: movieData.tmdbId,
            original_title: movieData.title,
            overview: movieData.overview,
            popularity: movieData.popularity,
            poster_path: movieData.posterPath.replace("https://image.tmdb.org/t/p/original/", ""),
            release_date: movieData.releaseDate,
            vote_average: movieData.voteAverage,
          });
          setFormData({
            title: movieData.title,
            overview: movieData.overview,
            popularity: movieData.popularity,
            releaseDate: movieData.releaseDate,
            voteAverage: movieData.voteAverage,
            videos: movieData.videos || [],
            cast: movieData.cast || [],
          });
        })
        .catch(() => {
          setError("Unable to load movie details. Please try again later.");
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [movieId]);

  return (
    <>
      <h1>{movieId !== undefined ? "Edit" : "Create"} Movie</h1>

      {error && <div className="error-message">{error}</div>}
      {isLoading && <div className="loading-message">Loading...</div>}

      {movieId === undefined && (
        <>
          <div className="search-container">
            <label htmlFor="movie-search" className="search-label">Search Movie:</label>
            <div className="search-input-container">
              <input
                id="movie-search"
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setError("");
                }}
                onKeyPress={handleKeyPress}
                placeholder="Enter movie title..."
                disabled={isLoading}
                className="search-input"
              />
              <button
                className="search-button"
                type="button"
                onClick={() => {
                  setCurrentPage(1);
                  handleSearch();
                }}
                disabled={isLoading || !query.trim()}
              >
                {isLoading ? "Searching..." : "Search"}
              </button>
            </div>
          </div>
          <div className="searched-movie">
            {searchedMovieList.map((movie) => (
              <p
                key={movie.id}
                onClick={() => handleSelectMovie(movie)}
                className={selectedMovie?.id === movie.id ? "selected" : ""}
              >
                {movie.original_title}
              </p>
            ))}
          </div>
          
          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="pagination-button"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1 || isLoading}
              >
                Previous
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button
                className="pagination-button"
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages || isLoading}
              >
                Next
              </button>
              
            </div>
          )}
        </>
      )}

      <form>
        <div className="form-group">
          <label htmlFor="title">Title:</label>
          <input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Enter movie title"
            disabled={isLoading}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="overview">Overview:</label>
          <textarea
            id="overview"
            name="overview"
            value={formData.overview}
            onChange={handleInputChange}
            placeholder="Enter movie overview"
            disabled={isLoading}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="popularity">Popularity:</label>
          <input
            id="popularity"
            name="popularity"
            type="number"
            step="0.1"
            value={formData.popularity}
            onChange={handleInputChange}
            placeholder="Enter popularity score"
            disabled={isLoading}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="releaseDate">Release Date:</label>
          <input
            id="releaseDate"
            name="releaseDate"
            type="date"
            value={formData.releaseDate}
            onChange={handleInputChange}
            placeholder="Enter release date"
            disabled={isLoading}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="voteAverage">Vote Average:</label>
          <input
            id="voteAverage"
            name="voteAverage"
            type="number"
            step="0.1"
            value={formData.voteAverage}
            onChange={handleInputChange}
            placeholder="Enter vote average"
            disabled={isLoading}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="videos">Videos:</label>
          <textarea
            id="videos"
            name="videos"
            value={formData.videos.map(video => video.key).join("\n")}
            onChange={(e) => {
              const keys = e.target.value.split("\n");
              setFormData((prevData) => ({
                ...prevData,
                videos: keys.map((key) => ({ key })),
              }));
            }}
            placeholder="Enter video keys, one per line"
            disabled={isLoading}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="cast">Cast:</label>
          <textarea
            id="cast"
            name="cast"
            value={formData.cast.map(castMember => castMember.name).join("\n")}
            onChange={(e) => {
              const names = e.target.value.split("\n");
              setFormData((prevData) => ({
                ...prevData,
                cast: names.map((name) => ({ name })),
              }));
            }}
            placeholder="Enter cast names, one per line"
            disabled={isLoading}
            required
          />
        </div>
        
        <div className="form-actions">
          <button type="button" onClick={movieId ? handleUpdate : handleSave} disabled={isLoading}>
            {isLoading ? "Saving..." : movieId ? "Update" : "Save"}
          </button>
        </div>
      </form>
    </>
  );
};

export default Form;
