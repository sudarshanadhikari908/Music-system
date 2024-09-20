// src/appRoutes.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/auth/login";
import Register from "./pages/auth/register";
import ProtectedRoute from "./hoc/ProtectedRoute";
import User from "./pages/users";
import CreateUser from "./pages/users/create";
import UpdateUser from "./pages/users/update";
import ForbiddenPage from "./pages/403";
import Artists from "./pages/artist";
import UserDetail from "./pages/users/userDetail";
import CreateArtist from "./pages/artist/create";
import ArtistDetail from "./pages/artist/artistDetail";
import UpdateArtist from "./pages/artist/update";
import Musics from "./pages/music";
import CreateMusic from "./pages/music/create";
import UpdateMusic from "./pages/music/update";
import SongDetail from "./pages/music/musicDetail";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />
        <Route path="/403" element={<ForbiddenPage />} />
        <Route path="/" element={<ProtectedRoute element={<User />} />} />
        <Route path="/user/create" element={<ProtectedRoute element={<CreateUser />} />} />
        <Route path="/user/:id" element={<ProtectedRoute element={<UserDetail />} />} />
        <Route path="/user/update/:id" element={<ProtectedRoute element={<UpdateUser />} />} />
        <Route path="/artists" element={<ProtectedRoute element={<Artists />} />} />
        <Route path="/artist/create" element={<ProtectedRoute element={<CreateArtist />} />} />
        <Route path="/artist/:id" element={<ProtectedRoute element={<ArtistDetail />} />} />
        <Route path="/artist/update/:id" element={<ProtectedRoute element={<UpdateArtist />} />} />
        <Route path="/artists/:artistId/songs" element={<ProtectedRoute element={<Musics />} />} />
        <Route path="/artists/:artistId/song/create" element={<ProtectedRoute element={<Musics />} />} />
        <Route path="/artist/:artistId/song/create" element={<ProtectedRoute element={<CreateMusic />} />} />
        <Route path="/artist/:artistId/song/update/:songId" element={<ProtectedRoute element={<UpdateMusic />} />} />
        <Route path="/artist/:artistId/song/:songId" element={<ProtectedRoute element={<SongDetail />} />} />

      </Routes>
    </Router>
  );
};

export default AppRoutes;
