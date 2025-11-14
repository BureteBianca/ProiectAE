import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import FavoritesPage from "./pages/FavoritesPage";
import Register from "./pages/Register";
import Login from "./pages/Login";
import CreateProductPage from "./pages/CreateProductPage";
import EditProductPage from "./pages/EditProductPage";
import ProfilePage from "./pages/ProfilePage"; // 🟢 importă pagina de profil
import { ProtectedLayout, AuthLayout } from "./components/ProtectedRoute";
import { AdminRoute } from "./components/AdminRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      // Public routes
      { index: true, element: <HomePage /> },
      { path: "products", element: <ProductsPage /> },

      // Protected routes (user must be logged in)
      {
        element: <ProtectedLayout />,
        children: [
          { path: "favorites", element: <FavoritesPage /> }, // favorite products
          { path: "profile", element: <ProfilePage /> },       // 🟢 ruta profil
        ],
      },

      // Admin routes (user must be admin)
      {
        element: <AdminRoute />,
        children: [
          { path: "products/create", element: <CreateProductPage /> },
          { path: "products/edit/:id", element: <EditProductPage /> },
        ],
      },

      // Auth routes (user must NOT be logged in)
      {
        element: <AuthLayout />,
        children: [
          { path: "register", element: <Register /> },
          { path: "login", element: <Login /> },
        ],
      },
    ],
  },
]);
