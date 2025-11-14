// client/src/pages/ProductsPage.jsx
import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { fetchProducts, deleteProduct } from '../api/product.routes'
import LoadingSpinner from '../components/LoadingSpinner'
import { toggleFavorite, selectFavorites } from '../store/slices/favoritesSlice'

export default function ProductsPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [deletingId, setDeletingId] = useState(null)

  const user = useSelector((state) => state.user.user)
  const isAdmin = user?.role === 'admin'
  const favorites = useSelector(selectFavorites)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  // Load products
  useEffect(() => {
    const getProducts = async () => {
      try {
        setLoading(true)
        const { data } = await fetchProducts()
        if (data && Array.isArray(data)) {
          setProducts(data)
        } else {
          setError('Failed to load products')
        }
      } catch (err) {
        setError(err.message || 'Error fetching products')
      } finally {
        setLoading(false)
      }
    }
    getProducts()
  }, [])

  const handleEditClick = (id) => navigate(`/products/edit/${id}`)

  const handleDeleteClick = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return
    try {
      setDeletingId(id)
      const res = await deleteProduct(id)
      if (res?.success) {
        setProducts(products.filter((p) => p.id !== id))
        toast.success('Product deleted')
      } else {
        toast.error(res?.message || 'Failed to delete')
      }
    } catch (err) {
      toast.error(err.message || 'Error deleting product')
    } finally {
      setDeletingId(null)
    }
  }

  const handleCreateClick = () => navigate('/products/create')

  const handleToggleFavorite = (product) => {
    if (!user) {
      toast.error('You must be logged in to favorite products')
      return
    }
    dispatch(toggleFavorite(product))
  }

  const isFavorite = (productId) =>
    favorites.some((p) => p.id === productId)

  if (loading) return <LoadingSpinner />
  if (error)
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500 font-semibold">{error}</p>
      </div>
    )

  return (
    <div className="bg-white min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Products</h2>
        {isAdmin && (
          <button
            onClick={handleCreateClick}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-500"
          >
            Create Product
          </button>
        )}
      </div>

      {products.length === 0 ? (
        <p>No products available</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product.id} className="relative group border p-4 rounded-md">
              <img
                src={product.image || 'https://via.placeholder.com/300'}
                alt={product.name}
                className="w-full h-48 object-cover rounded-md mb-2"
              />

              <h3 className="font-semibold">{product.name}</h3>
              <p className="text-gray-500">{product.category}</p>
              <p className="font-bold">${product.price}</p>

              {/* Favorite Heart */}
              <button
                onClick={() => handleToggleFavorite(product)}
                className="absolute top-2 right-2 z-10 focus:outline-none"
              >
                {isFavorite(product.id) ? (
                  <svg
                    className="w-6 h-6 text-red-500"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                ) : (
                  <svg
                    className="w-6 h-6 text-gray-400 hover:text-red-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318C5.268 5.368 6.635 5 8 5c1.365 0 2.732.368 3.682 1.318l.318.318.318-.318C13.268 5.368 14.635 5 16 5c1.365 0 2.732.368 3.682 1.318 1.95 1.95 1.95 5.123 0 7.073L12 21.35 4.318 13.39c-1.95-1.95-1.95-5.123 0-7.072z"
                    />
                  </svg>
                )}
              </button>

              {/* Admin buttons */}
              {isAdmin && (
                <div className="absolute bottom-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <button
                    onClick={() => handleEditClick(product.id)}
                    className="px-2 py-1 bg-blue-500 text-white rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClick(product.id)}
                    className="px-2 py-1 bg-red-500 text-white rounded"
                    disabled={deletingId === product.id}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}