import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./AuthContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./ProtectedRoute";
import CreatePost from "./pages/CreatePost";
import PostDetail from "./pages/PostDetail";


export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route index element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/post/:postId" element={<PostDetail />} />
          <Route path="/create" element={<ProtectedRoute><CreatePost /></ProtectedRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
