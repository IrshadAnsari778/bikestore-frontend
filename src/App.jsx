import { Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast'; // 1. Import this
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import Admin from './pages/Admin';
import Cart from './pages/Cart';
import ProductDetails from './pages/ProductDetails';

export default function App() {
  const location = useLocation();
  const isAdminPage = location.pathname === '/admin';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* 2. Add this special tag here. It handles the popups for the whole app */}
      <Toaster position="top-center" reverseOrder={false} />

      {!isAdminPage && <Navbar />}
      
      <div className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
      </div>

      {!isAdminPage && <Footer />}
    </div>
  );
}