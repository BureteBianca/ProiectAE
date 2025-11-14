// client/src/api/favorites.routes.js
import axios from 'axios';

/**
 * Obține lista de favorite pentru utilizatorul logat
 */
export const fetchFavoritesAPI = async () => {
  try {
    const response = await axios.get('/api/favorites'); 
    return response.data;
  } catch (err) {
    console.error('Error fetching favorites:', err);
    throw err;
  }
};

/**
 * Adaugă un produs la favorite
 */
export const addFavoriteAPI = async (product) => {
  try {
    const response = await axios.post('/api/favorites', product);
    return response.data;
  } catch (err) {
    console.error('Error adding favorite:', err);
    throw err;
  }
};

/**
 * Șterge un produs din favorite după ID
 */
export const removeFavoriteAPI = async (productId) => {
  try {
    const response = await axios.delete(`/api/favorites/${productId}`);
    return response.data;
  } catch (err) {
    console.error('Error removing favorite:', err);
    throw err;
  }
};