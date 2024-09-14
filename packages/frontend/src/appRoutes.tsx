// src/appRoutes.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/auth/login";
import Register from "./pages/auth/register";
import ProtectedRoute from "./hoc/ProtectedRoute";
import User from "./pages/user";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />
        <Route path="/" element={<ProtectedRoute element={<User />} />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
