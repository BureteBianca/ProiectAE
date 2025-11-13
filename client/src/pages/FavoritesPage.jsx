import { useSelector, useDispatch } from 'react-redux';
import { removeFavorite } from '../store/slices/favoritesSlice';

export default function FavoritesPage() {
  const favorites = useSelector(state => state.favorites.items);
  const dispatch = useDispatch();

  if (!favorites || favorites.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-500">
        No favorite products yet.
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen p-6">
      <h2 className="text-2xl font-bold mb-6">Your Favorites</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {favorites.map(product => (
          <div key={product.id} className="border rounded p-3 relative">
            <img
              src={product.image || 'https://via.placeholder.com/300'}
              alt={product.name}
              className="w-full h-48 object-cover rounded"
            />
            <div className="mt-2 flex justify-between items-center">
              <div>
                <h3 className="font-semibold">{product.name}</h3>
                <p className="text-gray-500 text-sm">{product.category}</p>
              </div>
              <p className="font-medium">${product.price}</p>
            </div>
            {/* Remove favorite */}
            <button
              onClick={() => dispatch(removeFavorite(product.id))}
              className="absolute top-2 right-2 text-2xl text-red-500"
            >
              ❤️
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
