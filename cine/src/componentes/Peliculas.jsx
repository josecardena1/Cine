import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../Peliculas.css';
import { useDispatch, useSelector } from 'react-redux';
import { addEntradas, agregarPeliculaFavorita, eliminarPeliculaFavorita } from '../redux/userSlice'; 
import YouTube from 'react-youtube';

function App() {
  const API_URL = "https://api.themoviedb.org/3";
  const API_KEY = "4f5f43495afcc67e9553f6c684a82f84";
  const IMAGE_PATH = "https://image.tmdb.org/t/p/original";
  const URL_IMAGE = "https://image.tmdb.org/t/p/original";

  const [movies, setMovies] = useState([]);
  const [searchKey, setSearchKey] = useState("");
  const [trailer, setTrailer] = useState(null);
  const [movie, setMovie] = useState({ title: "Loading Movies" });
  const [playing, setPlaying] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedTime, setSelectedTime] = useState("3");
  const [selectedRoom, setSelectedRoom] = useState(1);
  const [numEntradas, setNumEntradas] = useState(1); // Estado para almacenar el número de entradas
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);
  const dispatch = useDispatch();
  const entradasRedux = useSelector(state => state.user.entradasPorPelicula);
  const peliculasFavoritas = useSelector(state => state.user.peliculasFavoritas);

  const [formErrors, setFormErrors] = useState({});

  const fetchMovies = async (searchKey) => {
    const type = searchKey ? "search" : "discover";
    const {
      data: { results },
    } = await axios.get(`${API_URL}/${type}/movie`, {
      params: {
        api_key: API_KEY,
        query: searchKey,
      },
    });
    setMovies(results);
    setMovie(results[0]);

    if (results.length) {
      await fetchMovie(results[0].id);
    }
  };

  const fetchMovie = async (id) => {
    const { data } = await axios.get(`${API_URL}/movie/${id}`, {
      params: {
        api_key: API_KEY,
        append_to_response: "videos",
      },
    });

    if (data.videos && data.videos.results) {
      const trailer = data.videos.results.find(
        (vid) => vid.name === "Official Trailer"
      );
      setTrailer(trailer ? trailer : data.videos.results[0]);
    }
    setMovie(data);
  };

  const selectMovie = async (movie) => {
    fetchMovie(movie.id);
    setMovie(movie);
    setSelectedMovie(movie);
    window.scrollTo(0, 0);
  };

  const searchMovies = (e) => {
    e.preventDefault();
    fetchMovies(searchKey);
  };

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setPurchaseSuccess(false); // Reset purchase success state when closing modal
    setFormErrors({}); // Reset form errors when closing modal
  };

  const handleBuyClick = () => {
    // Dispatch action to add entradas
    dispatch(addEntradas({ peliculaId: selectedMovie.title, cantidad: numEntradas }));
    
    // Save selected movie data to sessionStorage
    sessionStorage.setItem('selectedMovie', JSON.stringify(selectedMovie));
    sessionStorage.setItem('selectedTime', selectedTime);
  };

  const handleAgregarFavorito = () => {
    // Dispatch action to add selected movie to favorites
    dispatch(agregarPeliculaFavorita(selectedMovie));
    
    // Get existing favorites from sessionStorage or initialize as an empty array
    const favoritesFromStorage = JSON.parse(sessionStorage.getItem('peliculasFavoritas')) || [];
    
    // Update favorites in sessionStorage
    sessionStorage.setItem('peliculasFavoritas', JSON.stringify([...favoritesFromStorage, selectedMovie]));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedTime || !selectedRoom) {
      setFormErrors({ time: !selectedTime, room: !selectedRoom });
      return;
    }
    // Simulate successful purchase
    setPurchaseSuccess(true);
    setTimeout(() => {
      setModalOpen(false);
      setPurchaseSuccess(false);
      setFormErrors({});
    }, 3000); // Close modal and reset success message after 3 seconds
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  return (
    <div>
      <h2 className="text-center mt-5 mb-5" style={{ color: 'white', textShadow: '0 0 10px white, 0 0 20px white, 0 0 30px white, 0 0 40px white, 0 0 50px white, 0 0 60px white, 0 0 70px white' }}>Trailer Popular Movies</h2>

      <form className="container mb-4" onSubmit={searchMovies}>
        <input
          type="text"
          placeholder="search"
          onChange={(e) => setSearchKey(e.target.value)}
        />
        <button className="btn btn-primary">Search</button>
      </form>

      <div>
        <main>
          {movie ? (
            <div
              className="viewtrailer"
              style={{
                backgroundImage: `url("${IMAGE_PATH}${movie.backdrop_path}")`,
              }}
            >
              {playing ? (
                <>
                  <YouTube
                    videoId={trailer.key}
                    className="reproductor container"
                    containerClassName={"youtube-container amru"}
                    opts={{
                      width: "100%",
                      height: "100%",
                      playerVars: {
                        autoplay: 1,
                        controls: 0,
                        cc_load_policy: 0,
                        fs: 0,
                        iv_load_policy: 0,
                        modestbranding: 0,
                        rel: 0,
                        showinfo: 0,
                      },
                    }}
                  />
                  <button onClick={() => setPlaying(false)} className="boton">
                    Close
                  </button>
                </>
              ) : (
                <div className="container">
                  <div className="">
                    {trailer ? (
                      <button
                        className="boton"
                        onClick={() => setPlaying(true)}
                        type="button"
                      >
                        Play Trailer
                      </button>
                    ) : (
                      "Sorry, no trailer available"
                    )}
                    <h1 className="text-white">{movie.title}</h1>
                    <p className="text-white">{movie.overview}</p>
                    <button onClick={openModal} className="btn btn-primary">Comprar</button>
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </main>
      </div>

      {modalOpen && selectedMovie && (
        <div className="popup">
          <div className="popup-content">
            <span className="close" onClick={closeModal}>&times;</span>
            <h2>Compra de entradas para {selectedMovie.title}</h2>

            {/* Primera "carta" */}
            <div className="card">
              <h3>Valoración: {selectedMovie.vote_average}</h3>
              <p>Actores: {selectedMovie.credits && selectedMovie.credits.cast ? selectedMovie.credits.cast.slice(0, 3).map(actor => actor.name).join(", ") : "No disponible"}</p>
              {selectedMovie.poster_path && <img src={`${URL_IMAGE + selectedMovie.poster_path}`} alt="Poster" />}
            </div>

            {/* Segunda "carta" */}
            <div className="card">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="time">Hora:</label>
                  <select
                    id="time"
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className={formErrors.time ? 'error' : ''}
                  >
                    <option value="">Selecciona una hora</option>
                    <option value="3">3:00 PM</option>
                    <option value="5">5:00 PM</option>
                    <option value="7">7:00 PM</option>
                    <option value="9">9:00 PM</option>
                  </select>
                  {formErrors.time && <p className="error-text">Campo obligatorio</p>}
                </div>
                <div className="form-group">
                  <label htmlFor="room">Sala:</label>
                  <input
                    type="number"
                    id="room"
                    value={selectedRoom}
                    min={1}
                    max={7}
                    onChange={(e) => setSelectedRoom(parseInt(e.target.value))}
                    className={formErrors.room ? 'error' : ''}
                  />
                  {formErrors.room && <p className="error-text">Campo obligatorio</p>}
                </div>
                {/* Nuevo campo para el número de entradas */}
                <div className="form-group">
                  <label htmlFor="numEntradas">Número de entradas:</label>
                  <input
                    type="number"
                    id="numEntradas"
                    value={numEntradas}
                    min={1}
                    onChange={(e) => setNumEntradas(parseInt(e.target.value))}
                  />
                </div>
                <div className="buttons">
                  <button onClick={handleBuyClick} type="submit" className="botones">Confirmar compra</button>
                  <button onClick={handleAgregarFavorito} type="button" className="botones">Añadir a favoritos</button>
                </div>
              </form>
              {purchaseSuccess && <p className="text-success">¡Compra realizada con éxito!</p>}
            </div>
          </div>
        </div>
      )}

      <div className="container mt-3">
        {movies.map((movie) => (
          <div
            key={movie.id}
            className="col-md-4 mb-3"
            onClick={() => selectMovie(movie)}
          >
            <img
              src={`${URL_IMAGE + movie.poster_path}`}
              alt=""
              height={600}
              width="100%"
            />
            <h4 className="text-center" style={{ color: 'white', textShadow: '0 0 10px white, 0 0 20px white, 0 0 30px white, 0 0 40px white, 0 0 50px white, 0 0 60px white, 0 0 70px white' }}>{movie.title}</h4>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
