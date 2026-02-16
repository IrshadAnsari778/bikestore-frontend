import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Package } from 'lucide-react';

export default function TrackOrder() {
  const [orderId, setOrderId] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (orderId.trim() === '') {
      alert("Please enter a valid Order ID");
      return;
    }
    // This instantly redirects them to the tracking page we already built!
    navigate(`/order-success/${orderId.trim()}`);
  };

  return (
    <div className="container mx-auto p-6 max-w-md mt-10">
      <div className="bg-white rounded-xl shadow-lg border p-8 text-center">
        <div className="flex justify-center mb-4">
          <Package className="text-orange-500" size={50} />
        </div>
        <h1 className="text-2xl font-bold mb-2">Track Your Order</h1>
        <p className="text-gray-500 mb-6 text-sm">
          Enter the Order ID you received on WhatsApp to check your live delivery status.
        </p>

        <form onSubmit={handleSearch} className="space-y-4">
          <div>
            <input 
              type="text" 
              placeholder="e.g. 65d4f3a..." 
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-center font-mono"
            />
          </div>
          <button 
            type="submit"
            className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg font-bold transition flex items-center justify-center gap-2"
          >
            <Search size={20} /> Find Order
          </button>
        </form>
      </div>
    </div>
  );
}