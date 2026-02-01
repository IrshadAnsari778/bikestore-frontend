import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, Check, Truck, Shield } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function ProductDetails() {
  const { id } = useParams(); // Get the ID from the URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const { addToCart } = useCart();

  // Fetch the single product details
  useEffect(() => {
    fetch(`https://bikestore-api-tzvs.onrender.com/api/products/${id}`)
      .then(res => res.json())
      .then(data => {
        setProduct(data);
        setLoading(false);
      })
      .catch(err => console.error("Error:", err));
  }, [id]);

  if (loading) return <div className="text-center p-20 text-xl">Loading details... ⚙️</div>;
  if (!product) return <div className="text-center p-20 text-xl text-red-500">Product not found ❌</div>;

  return (
    <div className="container mx-auto p-6 min-h-screen">
      {/* Back Button */}
      <Link to="/products" className="inline-flex items-center gap-2 text-gray-500 hover:text-orange-600 mb-6 transition">
        <ArrowLeft size={20} /> Back to Products
      </Link>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden grid md:grid-cols-2 gap-8 p-8">
        
        {/* LEFT: Image */}
        <div className="relative">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-96 object-cover rounded-lg border"
          />
          {!product.inStock && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-lg">
              <span className="text-white font-bold border-2 border-white px-6 py-2 rounded text-xl">OUT OF STOCK</span>
            </div>
          )}
        </div>

        {/* RIGHT: Details */}
        <div className="flex flex-col">
          <span className="text-sm text-orange-600 font-bold tracking-wide uppercase">{product.category}</span>
          <h1 className="text-4xl font-extrabold text-gray-900 mt-2 mb-2">{product.name}</h1>
          <p className="text-gray-500 text-lg mb-4">Compatibility: <span className="font-medium text-gray-800">{product.compatibility}</span></p>
          
          <div className="text-3xl font-bold text-gray-900 mb-6">₹{product.price}</div>

          <p className="text-gray-600 leading-relaxed mb-8 border-b pb-6">
            {product.description || "No specific description available for this product. It is designed to meet high-quality standards."}
          </p>

          {/* Action Area */}
          <div className="flex items-center gap-4 mb-8">
            {/* Quantity */}
            <div className="flex items-center border rounded-full px-3 py-2 bg-gray-50">
              <button onClick={() => setQty(q => Math.max(1, q - 1))} className="px-3 py-1 hover:bg-gray-200 rounded-full font-bold">-</button>
              <span className="w-8 text-center font-bold">{qty}</span>
              <button onClick={() => setQty(q => Math.min(10, q + 1))} className="px-3 py-1 hover:bg-gray-200 rounded-full font-bold">+</button>
            </div>

            {/* Add Button */}
            <button 
              onClick={() => addToCart(product, qty)}
              disabled={!product.inStock}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-full font-bold text-lg transition ${product.inStock ? 'bg-black text-white hover:bg-orange-600' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
            >
              <ShoppingCart size={22} />
              {product.inStock ? 'Add to Cart' : 'Out of Stock'}
            </button>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-2"><Truck size={18} className="text-green-600"/> Fast Delivery</div>
            <div className="flex items-center gap-2"><Shield size={18} className="text-blue-600"/> Genuine Parts</div>
            <div className="flex items-center gap-2"><Check size={18} className="text-orange-600"/> Quality Tested</div>
          </div>
        </div>

      </div>
    </div>
  );
}