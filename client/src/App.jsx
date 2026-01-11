import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/users/Home";
import Login from "./pages/Login";
import EditMovie from "./pages/admin/EditMovie";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./Layout";
import { AuthProvider, useAuth } from "./context/AuthContext";

/* ---------- Role Based Redirect ---------- */
const RoleRedirect = () => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;

  return user.role === "admin"
    ? <Navigate to="/admin/edit" />
    : <Navigate to="/" />;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/redirect" element={<RoleRedirect />} />
          <Route element={<Layout />}>
            <Route path="/" element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
            />
            <Route path="/admin/edit" element={
              <ProtectedRoute adminOnly>
                <EditMovie />
              </ProtectedRoute>
            }
            />

          </Route>
          <Route path="*" element={<Navigate to="/redirect" />} />

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
