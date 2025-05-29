import React from "react";
import { useCart } from "../context/cartContext";
import { Button } from "react-bootstrap";

const CartScreen = () => {
  const { cart, increment, decrement, removeItem } = useCart();

  // Convert $numberDecimal to a float
  const getPrice = (item) =>
    typeof item.price === "object"
      ? parseFloat(item.price.$numberDecimal)
      : parseFloat(item.price);

  const getItemTotal = (item) => getPrice(item) * item.qty;

  const cartTotal = cart.reduce((acc, item) => acc + getItemTotal(item), 0);

  if (cart.length === 0) {
    return <p>Your cart is empty.</p>;
  }

  return (
    <div className="cart-screen">
      <h2>Your Cart</h2>
      <ul>
        {cart.map((item) => (
          <li
            key={item.id}
            style={{
              marginBottom: "1rem",
              borderBottom: "1px solid #ddd",
              paddingBottom: "1rem",
            }}
          >
            <img
              src={item.imageUrl}
              alt={item.name}
              style={{ width: "100px", borderRadius: "8px" }}
            />
            <div>
              <h4>{item.name}</h4>
              <p>Price: ${getPrice(item).toFixed(2)}</p>
              <div className="d-flex align-items-center gap-2">
                <Button onClick={() => decrement(item.id)}>-</Button>
                <span>{item.qty}</span>
                <Button onClick={() => increment(item.id)}>+</Button>
                <Button
                  className="ms-auto"
                  onClick={() => removeItem(item.id)}
                  variant="outline-danger"
                >
                  Remove item
                </Button>
              </div>
              <p>Total: ${getItemTotal(item).toFixed(2)}</p>
            </div>
          </li>
        ))}
      </ul>
      <hr />
      <h3>Subtotal: ${cartTotal.toFixed(2)}</h3>
    </div>
  );
};

export default CartScreen;
