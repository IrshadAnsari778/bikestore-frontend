import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Package, Truck, Home, ArrowLeft } from 'lucide-react';

export default function OrderSuccess() {
  const { id } = useParams(); // Gets the Order ID from the URL
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const response = await fetch(`${backendUrl}/api/orders/${id}`);
        
        if (!response.ok) throw new Error("Order not found");
        
        const data = await response.json();
        setOrder(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) return <div className="text-center p-20 text-xl font-bold">Loading your order details...</div>;
  if (error) return <div className="text-center p-20 text-red-500 font-bold text-xl">{error}</div>;
  if (!order) return null;

  // Visual Status Helper
  const getStatusColor = (status) => {
    switch (status) {
      case 'Processing': return 'text-orange-500 bg-orange-100';
      case 'Shipped': return 'text-blue-500 bg-blue-100';
      case 'Out for Delivery': return 'text-purple-500 bg-purple-100';
      case 'Delivered': return 'text-green-500 bg-green-100';
      default: return 'text-gray-500 bg-gray-100';
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-3xl">
      <div className="bg-white rounded-xl shadow-lg border p-8 text-center">
        
        {/* Success Header */}
        <div className="flex justify-center mb-4">
          <CheckCircle className="text-green-500" size={64} />
        </div>
        <h1 className="text-3xl font-extrabold mb-2">Order Received!</h1>
        <p className="text-gray-500 mb-6">Thank you for shopping with us. We have received your order.</p>
        
        <div className="bg-gray-50 p-4 rounded-lg inline-block mb-8 border">
          <span className="text-sm text-gray-500">Order ID: </span>
          <span className="font-mono font-bold text-lg">{order._id}</span>
        </div>

        {/* Live Status Badge */}
        <div className="mb-10">
          <h2 className="text-xl font-bold mb-3">Current Status</h2>
          <span className={`px-6 py-2 rounded-full font-bold text-lg inline-flex items-center gap-2 ${getStatusColor(order.status)}`}>
            {order.status === 'Processing' && <Package size={20} />}
            {order.status === 'Shipped' && <Truck size={20} />}
            {order.status === 'Out for Delivery' && <Truck size={20} />}
            {order.status === 'Delivered' && <Home size={20} />}
            {order.status}
          </span>
          {order.status === 'Processing' && (
             <p className="text-sm text-gray-500 mt-2">Waiting for WhatsApp confirmation from your side.</p>
          )}
        </div>

        {/* Order Details Grid */}
        <div className="text-left bg-gray-50 p-6 rounded-lg border mb-8">
          <h3 className="font-bold text-lg border-b pb-2 mb-4">Delivery Details</h3>
          <p><strong>Name:</strong> {order.customerDetails.name}</p>
          <p><strong>Phone:</strong> {order.customerDetails.phone}</p>
          <p><strong>Address:</strong> {order.customerDetails.address}</p>
          
          <h3 className="font-bold text-lg border-b pb-2 mt-6 mb-4">Items Ordered</h3>
          <ul className="space-y-2">
            {order.orderItems.map((item, index) => (
              <li key={index} className="flex justify-between">
                <span>{item.qty}x {item.name}</span>
                <span className="font-bold">₹{item.price * item.qty}</span>
              </li>
            ))}
          </ul>
          <div className="flex justify-between mt-4 pt-4 border-t text-xl font-extrabold text-orange-600">
            <span>Total to Pay:</span>
            <span>₹{order.totalPrice}</span>
          </div>
        </div>

        <Link to="/products" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-bold transition">
          <ArrowLeft size={20} /> Continue Shopping
        </Link>
      </div>
    </div>
  );
}