import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AlbumListPage } from "./pages/AlbumListPage";
import { AlbumDetailPage } from "./pages/AlbumDetailPage";
import { AuthPage } from "./pages/AuthPage";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AppLayout } from "./components/Layout/AppLayout";

const router = createBrowserRouter([
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: "/", element: <AlbumListPage /> },
          { path: "/albums/:id", element: <AlbumDetailPage /> },
        ],
      },
    ],
  },
  { path: "/login", element: <AuthPage mode="login" /> },
  { path: "/register", element: <AuthPage mode="register" /> },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
