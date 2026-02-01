import { createContext, useState, useContext } from 'react';
import toast from 'react-hot-toast'; // Import the Toast library

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  // --- ADD TO CART (With Quantity) ---
  const addToCart = (product, quantity = 1) => {
    setCart((prevCart) => {
      // Check if item is already in the cart
      const existingItem = prevCart.find((item) => item._id === product._id);
      
      if (existingItem) {
        // If it exists, just update the quantity
        // (Old Qty + New Qty)
        return prevCart.map((item) =>
          item._id === product._id ? { ...item, qty: item.qty + quantity } : item
        );
      } else {
        // If it's new, add it to the list with the chosen quantity
        return [...prevCart, { ...product, qty: quantity }];
      }
    });

    // Show Success Notification
    toast.success(`Added ${quantity} ${product.name} to Cart! 🛒`, {
      style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
      },
    });
  };

  // --- REMOVE FROM CART ---
  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item._id !== id));
    
    // Show Remove Notification
    toast.error("Item removed from Cart", {
      style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
      },
    });
  };

  // --- CALCULATE TOTAL PRICE ---
  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.qty, 0);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, getTotalPrice }}>
      {children}
    </CartContext.Provider>
  );
}

// Custom Hook to use the Cart anywhere
export function useCart() {
  return useContext(CartContext);
}