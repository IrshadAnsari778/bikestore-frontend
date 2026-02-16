import { createContext, useState, useContext } from 'react';
import toast from 'react-hot-toast'; 

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  // --- ADD TO CART (With Quantity) ---
  const addToCart = (product, quantity = 1) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item._id === product._id);
      
      if (existingItem) {
        return prevCart.map((item) =>
          item._id === product._id ? { ...item, qty: item.qty + quantity } : item
        );
      } else {
        return [...prevCart, { ...product, qty: quantity }];
      }
    });

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

  // --- NEW: CLEAR ENTIRE CART (Used after successful checkout) ---
  const clearCart = () => {
    setCart([]); // Simply resets the cart array to be empty
  };

  return (
    // Make sure clearCart is added to the value object here!
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, getTotalPrice, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

// Custom Hook to use the Cart anywhere
export function useCart() {
  return useContext(CartContext);
}