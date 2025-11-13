// client/src/components/Navbar.jsx
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/userSlice';
import { selectFavorites } from '../store/slices/favoritesSlice';
import { HeartIcon, UserCircleIcon } from '@heroicons/react/24/outline';

export default function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loggedIn = useSelector(state => state.user.loggedIn);
  const favorites = useSelector(selectFavorites);

  const handleAuthClick = () => {
    if (loggedIn) {
      dispatch(logout());
      navigate('/');
    } else {
      navigate('/login');
    }
  };

  return (
    <nav className="bg-gray-800 p-4 flex justify-between items-center">
      <div className="flex space-x-6 items-center">
        <Link to="/" className="text-white font-bold hover:text-gray-200">Home</Link>
        <Link to="/products" className="text-gray-300 hover:text-white">Products</Link>
        <Link to="/favorites" className="relative text-gray-300 hover:text-white">
          <HeartIcon className="w-6 h-6" />
          {favorites.length > 0 && (
            <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {favorites.length}
            </span>
          )}
        </Link>
      </div>

      <button
        onClick={handleAuthClick}
        className="text-gray-300 hover:text-white font-semibold"
      >
        {loggedIn ? 'Sign out' : 'Sign in'}
      </button>
    </nav>
  );
}
