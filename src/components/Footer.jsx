import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-10 mt-auto">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Column 1: Brand Info */}
        <div>
          <h3 className="text-white text-xl font-bold mb-4">BikeStore</h3>
          <p className="text-sm leading-relaxed">
            Your one-stop shop for premium bike parts and accessories. 
            We help you build the machine of your dreams with high-quality components.
          </p>
        </div>

        {/* Column 2: Quick Links */}
        <div>
          <h3 className="text-white text-xl font-bold mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li><Link to="/" className="hover:text-orange-500 transition">Home</Link></li>
            <li><Link to="/products" className="hover:text-orange-500 transition">All Products</Link></li>
            <li><Link to="/cart" className="hover:text-orange-500 transition">My Cart</Link></li>
          </ul>
        </div>

        {/* Column 3: Contact & Social */}
        <div>
          <h3 className="text-white text-xl font-bold mb-4">Contact Us</h3>
          <ul className="space-y-3">
            <li className="flex items-center gap-2"><MapPin size={18} className="text-orange-500" /> Bengaluru, India</li>
            <li className="flex items-center gap-2"><Phone size={18} className="text-orange-500" /> +91 98765 43210</li>
            <li className="flex items-center gap-2"><Mail size={18} className="text-orange-500" /> support@bikestore.com</li>
          </ul>
          
          {/* Social Icons */}
          <div className="flex gap-4 mt-6">
            <a href="#" className="hover:text-blue-500 transition"><Facebook /></a>
            <a href="#" className="hover:text-blue-400 transition"><Twitter /></a>
            <a href="#" className="hover:text-pink-500 transition"><Instagram /></a>
          </div>
        </div>

      </div>

      {/* Copyright Line */}
      <div className="border-t border-gray-800 mt-10 pt-6 text-center text-sm">
        © 2026 BikeStore. All rights reserved.
      </div>
    </footer>
  );
}