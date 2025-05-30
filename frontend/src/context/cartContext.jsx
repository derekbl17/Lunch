import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./authContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);

  useEffect(() => {
    if (user?._id) {
      const stored = localStorage.getItem(`cart_${user._id}`);
      if (stored) {
        setCart(JSON.parse(stored));
      }
    }
  }, [user?._id]); // Only run when user._id changes

  useEffect(() => {
    if (!user) {
      setCart([]);
    }
  }, [user]);

  useEffect(() => {
    if (user?._id) {
      localStorage.setItem(`cart_${user?._id}`, JSON.stringify(cart));
    }
  }, [cart, user?._id]);

  const addItem = (item) => {
    const normalizedItem = {
      ...item,
      id: String(item._id), // 💥 this is key
      qty: 1,
    };

    setCart((prev) => {
      const exists = prev.find((i) => i._id === normalizedItem._id);
      if (exists) {
        return prev.map((i) =>
          i._id === normalizedItem._id ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...prev, normalizedItem];
    });
  };

  const increment = (id) =>
    setCart((prev) =>
      prev.map((i) => (i._id === id ? { ...i, qty: i.qty + 1 } : i))
    );

  const decrement = (id) =>
    setCart((prev) =>
      prev
        .map((i) => (i._id === id ? { ...i, qty: i.qty - 1 } : i))
        .filter((i) => i.qty > 0)
    );

  const removeItem = (id) =>
    setCart((prev) => prev.filter((i) => i._id !== id));

  return (
    <CartContext.Provider
      value={{ cart, setCart, addItem, removeItem, increment, decrement }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
