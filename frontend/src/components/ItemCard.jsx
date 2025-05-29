import { Card, Button, Badge, CardText } from "react-bootstrap";
import { FaRegStar, FaStar } from "react-icons/fa";
import { useAuth } from "../context/authContext";
import { useCart } from "../context/cartContext";
import { useLikeItemMutation } from "../api/item";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import ItemModal from "./ItemModal";

const ItemCard = ({ item }) => {
  const { user } = useAuth();
  const { cart, addItem, increment, decrement } = useCart();

  const cartItem = cart.find((i) => i._id === item._id);

  const { mutate: likeItem, error, isError } = useLikeItemMutation();

  const [showModal, setShowModal] = useState(false);

  const [imageError, setImageError] = useState(false);
  const [imageUrl, setImageUrl] = useState(
    item.imageUrl?.trim() ? item.imageUrl : null
  );

  useEffect(() => {
    // Basic URL format check before even trying to load
    if (!imageUrl || !/^https?:\/\/.+\/.+$/.test(imageUrl)) {
      setImageError(true);
      return;
    }

    // Create a hidden image element to test loadability
    const img = new Image();
    img.src = imageUrl;

    img.onload = () => {
      setImageError(false);
    };

    img.onerror = () => {
      setImageError(true);
    };
  }, [imageUrl]);

  const placeholderUrl = `https://placehold.co/600x400?text=${encodeURIComponent(
    item.name
  )}`;

  const handleLike = () => {
    likeItem(item._id, {
      onError: (err) =>
        toast.error(err.response?.data?.message || "Failed to like"),
    });
  };

  return (
    <>
      <Card className="h-100 border-warning text-white bg-dark">
        <div style={{ position: "relative" }}>
          <Card.Img
            variant="top"
            src={imageError ? placeholderUrl : imageUrl}
            alt={item.name}
            style={{ height: "200px", objectFit: "cover" }}
          />
          <Button
            className="p-2 border-0 bg-transparent"
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              zIndex: 1,
              color: "white",
              fontSize: "1.5rem",
              transition: "all 0.3s ease",
              textShadow: "0 2px 4px rgba(0,0,0,0.3)",
            }}
            onClick={handleLike}
          >
            {item.likes?.includes(user._id) ? (
              <FaStar className="text-warning" />
            ) : (
              <FaRegStar />
            )}
          </Button>
        </div>
        <Card.Body className="d-flex flex-column">
          <Card.Title as="h5">{item.name}</Card.Title>
          <Card.Text>
            {item.description.length > 100
              ? `${item.description.substring(0, 100)}...`
              : item.description}
          </Card.Text>
          <Card.Text>
            {parseFloat(item.price?.$numberDecimal).toFixed(2)} eur
          </Card.Text>
          <div className="mt-auto">
            <Badge bg="warning" text="dark">
              {item.likes?.length || 0} Likes
            </Badge>
          </div>
        </Card.Body>
        <Card.Footer className="d-flex justify-content-between">
          <Button
            variant="outline-warning"
            size="sm"
            className="me-2"
            onClick={() => setShowModal(true)}
          >
            View Item
          </Button>
          {!cartItem ? (
            <Button
              variant="outline-warning"
              size="sm"
              className="me-2"
              onClick={() => addItem(item)}
            >
              Add to cart
            </Button>
          ) : (
            <div className="quantity-controls">
              <Button
                variant="outline-warning"
                onClick={() => decrement(item._id)}
                className="ms-2 me-2"
              >
                -
              </Button>
              <span className="fw-bold">{cartItem.qty}</span>
              <Button
                variant="outline-warning"
                onClick={() => increment(item._id)}
                className="ms-2 me-2"
              >
                +
              </Button>
            </div>
          )}
        </Card.Footer>
      </Card>
      <ItemModal
        show={showModal}
        onHide={() => setShowModal(false)}
        post={item}
        img={imageError ? placeholderUrl : imageUrl}
      />
    </>
  );
};

export default ItemCard;
