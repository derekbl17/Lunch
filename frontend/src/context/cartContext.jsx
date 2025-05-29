import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const stored = localStorage.getItem("cart");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

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
      value={{ cart, addItem, removeItem, increment, decrement }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
