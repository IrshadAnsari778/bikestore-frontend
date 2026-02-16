import { useCart } from '../context/CartContext';
import { Trash2, MessageCircle } from 'lucide-react'; // Icons
import { useState } from 'react';

export default function Cart() {
  const { cart, removeFromCart, getTotalPrice } = useCart();
  
  // State for customer details
  const [customer, setCustomer] = useState({ name: '', address: '', phone: '' });

  const handleChange = (e) => {
    setCustomer({ ...customer, [e.target.name]: e.target.value });
  };

  // --- THE WHATSAPP LOGIC ---
  const handleCheckout = () => {
    if (!customer.name || !customer.address || !customer.phone) {
      alert("Please fill in your delivery details first!");
      return;
    }

    // 1. Create the Message String
    let message = `*🚴 New Bike Part Order!* \n\n`;
    message += `*Customer Details:*\n`;
    message += `Name: ${customer.name}\n`;
    message += `Phone: ${customer.phone}\n`;
    message += `Address: ${customer.address}\n\n`;
    message += `*Order Summary:*\n`;

    cart.forEach((item) => {
      message += `- ${item.name} (x${item.qty}) - ₹${item.price * item.qty}\n`;
    });

    message += `\n*💰 Total Amount: ₹${getTotalPrice()}*`;
    message += `\n\n(I will pay via UPI/Cash upon confirmation)`;

    // 2. Encode the message for URL
    const encodedMessage = encodeURIComponent(message);

    // 3. Your WhatsApp Number (Replace this with your real number!)
    const myPhoneNumber = "916360764937"; 

    // 4. Open WhatsApp
    const whatsappUrl = `https://wa.me/${myPhoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  if (cart.length === 0) {
    return (
      <div className="text-center p-20">
        <h2 className="text-3xl font-bold text-gray-400 mb-4">Your Cart is Empty 🛒</h2>
        <p className="text-gray-500">Go back to Home and add some parts!</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        Shopping Cart <span className="text-sm bg-gray-200 px-2 py-1 rounded text-gray-600">{cart.length} items</span>
      </h1>

      <div className="flex flex-col md:flex-row gap-8">
        
        {/* LEFT SIDE: Cart Items */}
        <div className="w-full md:w-2/3 space-y-4">
          {cart.map((item) => (
            <div key={item._id} className="flex items-center justify-between bg-white p-4 rounded-lg shadow border">
              <div className="flex items-center gap-4">
                <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                <div>
                  <h3 className="font-bold">{item.name}</h3>
                  <p className="text-sm text-gray-500">₹{item.price} x {item.qty}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-bold text-lg">₹{item.price * item.qty}</span>
                <button onClick={() => removeFromCart(item._id)} className="text-red-500 hover:text-red-700">
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
          
          <div className="text-right text-2xl font-bold mt-4">
            Total: <span className="text-orange-600">₹{getTotalPrice()}</span>
          </div>
        </div>

        {/* RIGHT SIDE: Checkout Form */}
        <div className="w-full md:w-1/3 bg-white p-6 rounded-lg shadow-lg h-fit border">
          <h2 className="text-xl font-bold mb-4">Delivery Details</h2>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-bold text-gray-700">Full Name</label>
              <input type="text" name="name" value={customer.name} onChange={handleChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-orange-500 outline-none" placeholder="John Doe" />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700">Phone Number</label>
              <input type="tel" name="phone" value={customer.phone} onChange={handleChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-orange-500 outline-none" placeholder="+91 98765..." />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700">Address</label>
              <textarea name="address" value={customer.address} onChange={handleChange}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-orange-500 outline-none" rows="3" placeholder="Street, City, Pincode..."></textarea>
            </div>

            <button 
              onClick={handleCheckout}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition flex items-center justify-center gap-2 mt-4"
            >
              <MessageCircle size={20} />
              Order via WhatsApp
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}