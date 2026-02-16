import { useState, useEffect } from 'react';
import { Trash2, ToggleLeft, ToggleRight, PlusCircle, Package, Edit2, X, ClipboardList } from 'lucide-react'; // Added ClipboardList icon

export default function Admin() {
  // --- STATE MANAGEMENT ---
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]); // NEW: State to hold orders
  const [activeTab, setActiveTab] = useState('list'); // 'list', 'orders', or 'add'
  
  // Edit Mode State
  const [editingId, setEditingId] = useState(null); 

  // Form State
  const [formData, setFormData] = useState({ 
    name: '', price: '', category: 'Engine', compatibility: '', description: '' 
  });
  const [file, setFile] = useState(null);

  // Dynamic Backend URL (Works locally and live)
  const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // --- API FUNCTIONS ---

  const fetchProducts = () => {
    fetch(`${backendUrl}/api/products`)
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error("Error fetching products:", err));
  };

  // NEW: Fetch Orders
  const fetchOrders = () => {
    fetch(`${backendUrl}/api/orders`)
      .then(res => res.json())
      .then(data => setOrders(data))
      .catch(err => console.error("Error fetching orders:", err));
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchProducts();
      fetchOrders(); // Fetch orders when admin logs in
    }
  }, [isAuthenticated]);

  const handleLogin = () => {
    if (password === 'admin123') setIsAuthenticated(true);
    else alert('❌ Wrong Password!');
  };

  // NEW: Update Order Status
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`${backendUrl}/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (response.ok) {
        fetchOrders(); // Refresh the list to show the new status
      } else {
        alert("Failed to update status");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  // --- FORM HANDLERS ---
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleEdit = (product) => {
    setEditingId(product._id);
    setFormData({
      name: product.name, price: product.price, category: product.category,
      compatibility: product.compatibility, description: product.description
    });
    setActiveTab('add'); 
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({ name: '', price: '', category: 'Engine', compatibility: '', description: '' });
    setFile(null);
    const fileInput = document.getElementById('fileInput');
    if(fileInput) fileInput.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editingId && !file) return alert("Please select an image file!");

    const data = new FormData();
    if (file) data.append('image', file); 
    data.append('name', formData.name);
    data.append('price', formData.price);
    data.append('category', formData.category);
    data.append('compatibility', formData.compatibility);
    data.append('description', formData.description);

    try {
      let url = `${backendUrl}/api/products`;
      let method = 'POST';

      if (editingId) {
        url = `${backendUrl}/api/products/${editingId}`;
        method = 'PUT';
      }

      const response = await fetch(url, { method: method, body: data });

      if (response.ok) {
        alert(editingId ? "✅ Product Updated!" : "✅ Product Added!");
        resetForm();
        fetchProducts();
        setActiveTab('list');
      } else {
        alert("❌ Operation Failed");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("❌ Server Error");
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this product?")) {
      await fetch(`${backendUrl}/api/products/${id}`, { method: 'DELETE' });
      fetchProducts();
    }
  };

  const handleToggleStock = async (id) => {
    await fetch(`${backendUrl}/api/products/${id}/toggle`, { method: 'PUT' });
    fetchProducts();
  };

  // --- RENDER ---
  if (!isAuthenticated) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-900">
        <div className="bg-white p-8 rounded-lg shadow-xl w-96 text-center">
          <h2 className="text-2xl font-bold mb-4">🔐 Admin Access</h2>
          <input type="password" className="w-full p-3 border rounded mb-4" placeholder="Enter Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button onClick={handleLogin} className="w-full bg-black text-white p-3 rounded font-bold">Login</button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 min-h-screen">
      <div className="flex justify-between items-center mb-8 bg-white p-4 rounded shadow-sm">
        <h1 className="text-3xl font-bold flex items-center gap-2 text-gray-800">
          <Package className="text-orange-500" /> Dashboard
        </h1>
        <button onClick={() => setIsAuthenticated(false)} className="text-red-600 font-bold">Logout</button>
      </div>

      {/* --- TAB NAVIGATION --- */}
      <div className="flex gap-4 mb-6">
        <button onClick={() => { setActiveTab('list'); resetForm(); }} className={`px-6 py-2 rounded-full font-bold transition ${activeTab === 'list' ? 'bg-orange-500 text-white' : 'bg-white text-gray-600'}`}>
          Manage Products
        </button>
        
        {/* NEW: Orders Tab Button */}
        <button onClick={() => { setActiveTab('orders'); resetForm(); }} className={`px-6 py-2 rounded-full font-bold flex items-center gap-2 transition ${activeTab === 'orders' ? 'bg-orange-500 text-white' : 'bg-white text-gray-600'}`}>
          <ClipboardList size={18} /> Manage Orders
        </button>

        <button onClick={() => { setActiveTab('add'); resetForm(); }} className={`px-6 py-2 rounded-full font-bold flex items-center gap-2 transition ${activeTab === 'add' ? 'bg-orange-500 text-white' : 'bg-white text-gray-600'}`}>
          <PlusCircle size={18} /> {editingId ? 'Edit Product' : 'Add New Product'}
        </button>
      </div>

      {/* --- TAB CONTENT: ORDERS --- */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-lg shadow overflow-x-auto border">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="p-4">Order ID & Date</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Items</th>
                <th className="p-4">Total</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr><td colSpan="5" className="p-8 text-center text-gray-500 font-bold">No orders found.</td></tr>
              ) : (
                orders.map((o) => (
                  <tr key={o._id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <p className="font-mono font-bold text-xs">{o._id}</p>
                      <p className="text-gray-500 text-xs">{new Date(o.createdAt).toLocaleDateString()}</p>
                    </td>
                    <td className="p-4">
                      <p className="font-bold text-gray-800">{o.customerDetails.name}</p>
                      <p className="text-gray-500 text-xs">{o.customerDetails.phone}</p>
                      <p className="text-gray-500 text-xs truncate max-w-[150px]">{o.customerDetails.address}</p>
                    </td>
                    <td className="p-4">
                      <ul className="text-xs text-gray-600 space-y-1">
                        {o.orderItems.map((item, idx) => (
                          <li key={idx}>• {item.qty}x {item.name}</li>
                        ))}
                      </ul>
                    </td>
                    <td className="p-4 font-bold text-orange-600">₹{o.totalPrice}</td>
                    <td className="p-4">
                      {/* Dropdown to change status */}
                      <select
                        value={o.status}
                        onChange={(e) => handleUpdateOrderStatus(o._id, e.target.value)}
                        className={`p-2 rounded font-bold text-xs outline-none border cursor-pointer
                          ${o.status === 'Processing' ? 'bg-orange-100 text-orange-700 border-orange-200' : ''}
                          ${o.status === 'Shipped' ? 'bg-blue-100 text-blue-700 border-blue-200' : ''}
                          ${o.status === 'Out for Delivery' ? 'bg-purple-100 text-purple-700 border-purple-200' : ''}
                          ${o.status === 'Delivered' ? 'bg-green-100 text-green-700 border-green-200' : ''}
                        `}
                      >
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Out for Delivery">Out for Delivery</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* --- TAB CONTENT: PRODUCTS LIST --- */}
      {activeTab === 'list' && (
        <div className="bg-white rounded-lg shadow overflow-x-auto border">
          <table className="w-full text-left">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="p-4">Product</th>
                <th className="p-4">Price</th>
                <th className="p-4">Category</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id} className="border-b hover:bg-gray-50">
                  <td className="p-4 flex items-center gap-3">
                    <img src={p.image} className="w-12 h-12 rounded object-cover border" />
                    <div><p className="font-bold">{p.name}</p><p className="text-xs text-gray-500">{p.compatibility}</p></div>
                  </td>
                  <td className="p-4">₹{p.price}</td>
                  <td className="p-4"><span className="bg-gray-200 text-xs px-2 py-1 rounded">{p.category}</span></td>
                  <td className="p-4">
                    <button onClick={() => handleToggleStock(p._id)} className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${p.inStock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {p.inStock ? <ToggleRight size={16}/> : <ToggleLeft size={16}/>} {p.inStock ? 'In Stock' : 'Out'}
                    </button>
                  </td>
                  <td className="p-4 text-right flex justify-end gap-2">
                    <button onClick={() => handleEdit(p)} className="text-blue-500 hover:text-blue-700 bg-blue-50 p-2 rounded">
                      <Edit2 size={18} />
                    </button>
                    <button onClick={() => handleDelete(p._id)} className="text-red-500 hover:text-red-700 bg-red-50 p-2 rounded">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* --- TAB CONTENT: ADD/EDIT PRODUCT --- */}
      {activeTab === 'add' && (
         <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg border relative">
            {editingId && (
              <button onClick={() => { resetForm(); setActiveTab('list'); }} className="absolute top-4 right-4 text-gray-400 hover:text-red-500">
                <X size={24} />
              </button>
            )}

            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              {editingId ? `Editing: ${formData.name}` : 'New Product Details'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div><label className="block text-sm font-bold mb-1">Name</label><input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-3 border rounded" required /></div>
              <div className="flex gap-4">
                <div className="w-1/2"><label className="block text-sm font-bold mb-1">Price (₹)</label><input type="number" name="price" value={formData.price} onChange={handleChange} className="w-full p-3 border rounded" required /></div>
                <div className="w-1/2"><label className="block text-sm font-bold mb-1">Compatibility</label><input type="text" name="compatibility" value={formData.compatibility} onChange={handleChange} className="w-full p-3 border rounded" required /></div>
              </div>
              
              <div>
                <label className="block text-sm font-bold mb-1">Upload Image {editingId && <span className="text-gray-400 font-normal">(Optional - leave empty to keep current image)</span>}</label>
                <input id="fileInput" type="file" accept="image/*" onChange={handleFileChange} className="w-full p-2 border rounded bg-gray-50" required={!editingId} />
              </div>

              <div><label className="block text-sm font-bold mb-1">Category</label><select name="category" value={formData.category} onChange={handleChange} className="w-full p-3 border rounded"><option>Engine</option><option>Brakes</option><option>Body</option><option>Electrical</option><option>Accessories</option><option>Tyres</option></select></div>
              <div><label className="block text-sm font-bold mb-1">Description</label><textarea name="description" value={formData.description} onChange={handleChange} className="w-full p-3 border rounded" rows="3"></textarea></div>
              
              <button type="submit" className={`w-full text-white p-4 rounded-lg font-bold text-lg shadow-lg transition ${editingId ? 'bg-blue-600 hover:bg-blue-700' : 'bg-black hover:bg-gray-800'}`}>
                {editingId ? 'Update Product' : 'Add Product'}
              </button>
            </form>
         </div>
      )}
    </div>
  );
}