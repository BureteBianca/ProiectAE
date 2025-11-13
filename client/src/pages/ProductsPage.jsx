import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { fetchProducts, deleteProduct } from '../api/product.routes';
import LoadingSpinner from '../components/LoadingSpinner';
import { toggleFavorite } from '../store/slices/favoritesSlice';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const user = useSelector(state => state.user.user);
  const favorites = useSelector(state => state.favorites.items);
  const dispatch = useDispatch();
  const isAdmin = user?.role === 'admin';
  const navigate = useNavigate();

  useEffect(() => {
    const getProducts = async () => {
      try {
        setLoading(true);
        const { data } = await fetchProducts();
        if (Array.isArray(data)) setProducts(data);
        else setError('Failed to load products');
      } catch (err) {
        setError(err.message || 'An error occurred while fetching products');
      } finally {
        setLoading(false);
      }
    };
    getProducts();
  }, []);

  const handleEditClick = (id) => navigate(`/products/edit/${id}`);
  const handleDeleteClick = async (id) => {
    if (!confirm('Are you sure?')) return;
    try {
      setDeletingId(id);
      const response = await deleteProduct(id);
      if (response?.success) {
        setProducts(products.filter(p => p.id !== id));
        toast.success('Product deleted');
      } else {
        toast.error(response?.message || 'Failed to delete product');
      }
    } catch (err) {
      toast.error(err.message || 'Error deleting product');
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleFavorite = (product) => {
    dispatch(toggleFavorite(product));
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="bg-white min-h-screen p-6">
      <h2 className="text-2xl font-bold mb-6">Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map(product => {
          const isFavorite = favorites.some(f => f.id === product.id);
          return (
            <div key={product.id} className="border rounded p-3 relative group">
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
              {/* Inimioară */}
              <button
                onClick={() => handleToggleFavorite(product)}
                className={`absolute top-2 right-2 text-2xl transition-colors ${
                  isFavorite ? 'text-red-500' : 'text-gray-300 hover:text-red-500'
                }`}
              >
                ❤️
              </button>

              {/* Admin buttons */}
              {isAdmin && (
                <div className="absolute bottom-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition">
                  <button onClick={() => handleEditClick(product.id)} className="bg-blue-500 text-white p-1 rounded">Edit</button>
                  <button
                    onClick={() => handleDeleteClick(product.id)}
                    disabled={deletingId === product.id}
                    className="bg-red-500 text-white p-1 rounded"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
