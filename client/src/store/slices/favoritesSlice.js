// client/src/store/slices/favoritesSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [], // array cu produsele favorite
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    addFavorite: (state, action) => {
      const exists = state.items.some(item => item.id === action.payload.id);
      if (!exists) {
        state.items.push(action.payload);
      }
    },
    removeFavorite: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    toggleFavorite: (state, action) => {
      const exists = state.items.some(item => item.id === action.payload.id);
      if (exists) {
        state.items = state.items.filter(item => item.id !== action.payload.id);
      } else {
        state.items.push(action.payload);
      }
    },
    clearFavorites: (state) => {
      state.items = [];
    }
  },
});

export const { addFavorite, removeFavorite, toggleFavorite, clearFavorites } = favoritesSlice.actions;
export const selectFavorites = (state) => state.favorites.items;

export default favoritesSlice.reducer;