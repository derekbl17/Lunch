import { Card, Button, Badge, CardText } from "react-bootstrap";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { useAuth } from "../context/authContext";
import { useLikeItemMutation } from "../api/item";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import ItemModal from "./ItemModal";

const ItemCard = ({ item }) => {
  const { user } = useAuth();
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
      <Card className="h-100">
        <div style={{ position: "relative" }}>
          <Card.Img
            variant="top"
            src={imageError ? placeholderUrl : imageUrl}
            alt={item.name}
            style={{ height: "200px", objectFit: "cover" }}
          />
          <button
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
              <FaHeart className="text-danger" />
            ) : (
              <FaRegHeart />
            )}
          </button>
        </div>
        <Card.Body className="d-flex flex-column">
          <Card.Title as="h5">{item.name}</Card.Title>
          <Card.Text className="text-muted">
            {item.description.length > 100
              ? `${item.description.substring(0, 100)}...`
              : item.description}
          </Card.Text>
          <Card.Text>
            {parseFloat(item.price?.$numberDecimal).toFixed(2)} eur
          </Card.Text>
          <div className="mt-auto">
            <Badge bg="secondary" className="me-2">
              {item.category?.name || "Uncategorized"}
            </Badge>
            <Badge bg="info">{item.likes?.length || 0} Likes</Badge>
          </div>
        </Card.Body>
        <Card.Footer>
          <Button
            variant="primary"
            size="sm"
            className="me-2"
            onClick={() => setShowModal(true)}
          >
            View Post
          </Button>
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
