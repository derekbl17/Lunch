import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./context/authContext.jsx";
import { CartProvider } from "./context/cartContext.jsx";
import App from "./App.jsx";
import HomeScreen from "./screens/HomeScreen.jsx";
import LoginScreen from "./screens/LoginScreen.jsx";
import RegisterScreen from "./screens/RegisterScreen.jsx";
import ProfileScreen from "./screens/ProfileScreen.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import AdminScreen from "./screens/AdminScreen.jsx";
import NotFoundScreen from "./screens/NotFoundScreen.jsx";
import NoAuthorization from "./screens/NoAuthorization.jsx";
// import CreatePostScreen from "./screens/CreatePostScreen.jsx";
import FavoriteScreen from "./screens/FavoriteScreen.jsx";
// import MyPosts from "./screens/MyPosts.jsx";
// import BlockedPosts from "./screens/AdminBlockedPosts.jsx";
import CartScreen from "./screens/CartScreen.jsx";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <HomeScreen /> },
      { path: "login", element: <LoginScreen /> },
      { path: "register", element: <RegisterScreen /> },
      { path: "no-auth", element: <NoAuthorization /> },
      {
        path: "",
        element: <PrivateRoute allowed={["user", "admin"]} />,
        children: [
          { path: "profile", element: <ProfileScreen /> },
          // { path: "new-post", element: <CreatePostScreen /> },
          { path: "favorites", element: <FavoriteScreen /> },
          // { path: "my-posts", element: <MyPosts /> },
          { path: "cart", element: <CartScreen /> },
        ],
      },
      {
        path: "admin",
        element: <PrivateRoute allowed={["admin"]} />,
        children: [
          { path: "panel", element: <AdminScreen /> },
          // { path: "blocked", element: <BlockedPosts /> },
        ],
      },
      { path: "*", element: <NotFoundScreen /> },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CartProvider>
        <RouterProvider router={router} />
      </CartProvider>
    </AuthProvider>
  </QueryClientProvider>
);
