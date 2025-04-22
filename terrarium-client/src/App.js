
import './App.css';
import RegisterPage from './pages/RegisterPage';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import HomePage from './pages/HomePage';
import GameDetailPage from './pages/GameDetailPage';
import ShopifyDetailPage from './pages/ShopifyDetailsPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AddProductPage from './pages/AddProductPage';
import EditProductPage from './pages/EditProductPage';


import NavBar from './components/NavBar';

function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/products/:slug" element={<GameDetailPage />} />
        <Route path="/shopify/:handle" element={<ShopifyDetailPage />} />
        <Route path="/admin" element={<AdminDashboardPage />} />
        <Route path="/add-product" element={<AddProductPage />} />
        <Route path="/edit-product/:id" element={<EditProductPage />} />

      </Routes>


    </>
  );
}
export default App;