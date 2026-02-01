import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Plus, Minus } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch products on load
  useEffect(() => {
    fetch('https://bikestore-api-tzvs.onrender.com/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => console.error("Error fetching products:", err));
  }, []);

  if (loading) return <div className="text-center p-10 text-xl">Loading parts... ⚙️</div>;

  return (
    <div className="container mx-auto p-6 min-h-screen">
      <h2 className="text-3xl font-bold mb-8 text-center">All Bike Parts</h2>
      
      {/* Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center text-gray-500 mt-10">
          No products found. Admin needs to add some!
        </div>
      )}
    </div>
  );
}

// --- HELPER COMPONENT: Single Product Card ---
function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [qty, setQty] = useState(1);

  // Handle Quantity Change
  const handleIncrease = () => { if (qty < 10) setQty(qty + 1); };
  const handleDecrease = () => { if (qty > 1) setQty(qty - 1); };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition border group flex flex-col">
      
      {/* 1. IMAGE (Clickable Link) */}
      <Link to={`/product/${product._id}`} className="block relative h-48 overflow-hidden cursor-pointer">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
        />
        {/* Out of Stock Overlay */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-white font-bold border-2 border-white px-4 py-1 rounded shadow-lg transform -rotate-12">
              OUT OF STOCK
            </span>
          </div>
        )}
      </Link>

      {/* 2. CONTENT */}
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <div>
            <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600 font-medium uppercase tracking-wider">
              {product.category}
            </span>
            
            {/* Title (Clickable Link) */}
            <Link to={`/product/${product._id}`} className="block hover:text-orange-600 transition">
              <h2 className="text-lg font-bold mt-2 text-gray-800 leading-tight">{product.name}</h2>
            </Link>
          </div>
          <span className="text-xl font-bold text-orange-600">₹{product.price}</span>
        </div>
        
        <p className="text-sm text-gray-500 mb-4 flex-grow line-clamp-2">
          {product.compatibility}
        </p>
        
        {/* 3. CONTROLS (Quantity + Add Button) */}
        <div className="flex items-center justify-between gap-3 mt-auto pt-4 border-t border-gray-100">
          
          {/* Quantity Selector */}
          <div className="flex items-center border rounded-full px-2 py-1 bg-gray-50">
            <button 
              onClick={handleDecrease} 
              className="p-1 hover:bg-gray-200 rounded-full transition text-gray-600 disabled:opacity-50"
              disabled={!product.inStock}
            >
              <Minus size={16} />
            </button>
            
            <span className="mx-3 font-bold w-4 text-center text-sm">{qty}</span>
            
            <button 
              onClick={handleIncrease} 
              className="p-1 hover:bg-gray-200 rounded-full transition text-gray-600 disabled:opacity-50"
              disabled={!product.inStock}
            >
              <Plus size={16} />
            </button>
          </div>

          {/* Add to Cart Button */}
          <button 
            onClick={() => addToCart(product, qty)} 
            disabled={!product.inStock}
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm transition shadow-sm ${
              product.inStock 
                ? 'bg-black text-white hover:bg-orange-600 hover:shadow-md' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <ShoppingCart size={18} />
            {product.inStock ? 'Add' : 'Sold Out'}
          </button>
        </div>
      </div>
    </div>
  );
}