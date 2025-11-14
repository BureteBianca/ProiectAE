// client/src/pages/FavoritesPage.jsx
import { useSelector, useDispatch } from 'react-redux';
import { selectFavorites, toggleFavorite } from '../store/slices/favoritesSlice';
import { useNavigate } from 'react-router-dom';

export default function FavoritesPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const favorites = useSelector(selectFavorites); 

  const handleRemoveFavorite = (productId) => {
    dispatch(toggleFavorite(productId)); 
  };

  if (!favorites || favorites.length === 0) {
    return (
      <div className="bg-white h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 font-semibold">No favorite products yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen py-8 px-4">
      <h2 className="text-2xl font-bold mb-6">Your Favorite Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {favorites.map((product) => (
          <div key={product.id} className="border rounded-md p-4 relative">
            <img
              src={product.image || 'https://via.placeholder.com/300'}
              alt={product.name}
              className="w-full h-48 object-cover rounded-md mb-4"
            />
            <h3 className="text-lg font-semibold">{product.name}</h3>
            <p className="text-gray-500">{product.category}</p>
            <p className="text-gray-900 font-medium">${product.price}</p>

            <button
              onClick={() => handleRemoveFavorite(product.id)}
              className="absolute top-2 right-2 text-red-500 hover:text-red-600"
              title="Remove from favorites"
            >
              ♥
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}