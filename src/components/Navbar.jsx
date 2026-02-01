import { Link } from 'react-router-dom';
import { ShoppingCart, Wrench } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { cart } = useCart();

  return (
    <nav className="bg-gray-900 text-white p-4 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center relative">
        
        {/* 1. LEFT: Logo */}
        <Link to="/" className="text-xl md:text-2xl font-bold flex items-center gap-2">
          <Wrench className="text-orange-500 w-6 h-6" />
          BikeStore
        </Link>

        {/* 2. CENTER: Navigation Links (Hidden on Mobile, Visible on Desktop) */}
        {/* 'hidden md:flex' means: Hide on small screens, Flex on medium+ screens */}
        <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 gap-8">
          <Link to="/" className="hover:text-orange-500 font-medium text-lg">Home</Link>
          <Link to="/products" className="hover:text-orange-500 font-medium text-lg">All Products</Link>
        </div>

        {/* 3. RIGHT: Cart & Mobile Links */}
        <div className="flex gap-4 items-center">
          {/* Mobile Only Links (Simple version) */}
          <div className="flex md:hidden gap-3 text-sm font-medium text-gray-300">
            <Link to="/products" className="hover:text-white">Shop</Link>
          </div>

          <Link to="/cart" className="relative hover:text-orange-500">
            <ShoppingCart size={24} />
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-xs rounded-full px-1.5 py-0.5">
                {cart.length}
              </span>
            )}
          </Link>
        </div>

      </div>
    </nav>
  );
}