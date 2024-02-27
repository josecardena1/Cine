import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  entradasPorPelicula: {},
  peliculasFavoritas: [],
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    addEntradas: (state, action) => {
      const { peliculaId, cantidad } = action.payload;
      if (!state.entradasPorPelicula[peliculaId]) {
        state.entradasPorPelicula[peliculaId] = 0;
      }
      state.entradasPorPelicula[peliculaId] += cantidad;
    },
    agregarPeliculaFavorita: (state, action) => {
      const pelicula = action.payload;
      state.peliculasFavoritas.push(pelicula);
    },
    eliminarPeliculaFavorita: (state, action) => {
      const peliculaId = action.payload;
      state.peliculasFavoritas = state.peliculasFavoritas.filter(
        (pelicula) => pelicula.id !== peliculaId
      );
    },
  },
});

export const { addEntradas, agregarPeliculaFavorita, eliminarPeliculaFavorita } =
  userSlice.actions;

export default userSlice.reducer;
