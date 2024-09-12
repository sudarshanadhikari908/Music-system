// src/appRoutes.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/auth/login';

const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
            </Routes>
        </Router>
    );
};

export default AppRoutes;