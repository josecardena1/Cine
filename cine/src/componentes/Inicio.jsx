import React, { useState, useEffect } from 'react';
import '../Inicio.css'; // Importa los estilos

const API_URL = "https://api.themoviedb.org/3";
const API_KEY = "4f5f43495afcc67e9553f6c684a82f84";
const IMAGE_PATH = "https://image.tmdb.org/t/p/original";

const Inicio = () => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await fetch(`${API_URL}/movie/now_playing?api_key=${API_KEY}`);
        const data = await response.json();
        setMovies(data.results);
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    };

    fetchMovies();
  }, []);

  return (
    <div className="background-container">
      <div className="slider-container">
        {movies.map((movie) => (
          <div key={movie.id} className="pelicula-card">
            <img src={`${IMAGE_PATH}${movie.poster_path}`} alt={movie.title} />
          </div>
        ))}
      </div>

      <div className="inicio-container">
        <img src="../../public/img/imagen1.jpg" alt="Foto de tu cine" className="imagen-cine" />
        <div className="descripcion-cine">
          <h2>Bienvenido a Mi Cine</h2>
          <p>¡Disfruta de las últimas películas en nuestra pantalla grande!</p>
          <p>Horario de funcionamiento:</p>
          <p>Lunes a Viernes: 14:00 - 22:00</p>
          <p>Sábado y Domingo: 10:00 - 00:00</p>
        </div>
      </div>
    </div>
  );
};

export default Inicio;
