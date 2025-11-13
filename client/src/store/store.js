// client/src/store/store.js
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import favoritesReducer from './slices/favoritesSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    favorites: favoritesReducer,
  },
});
