import { Card, Button, Badge, CardText } from "react-bootstrap";
import StarRatings from "react-star-ratings";
import { useCart } from "../context/cartContext";
import { useRateItemsMutation } from "../api/item";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import ItemModal from "./ItemModal";

const ItemCard = ({ item }) => {
  const { cart, addItem, increment, decrement } = useCart();

  const cartItem = cart.find((i) => i._id === item._id);

  const { mutateAsync: rateItem } = useRateItemsMutation();

  const [showModal, setShowModal] = useState(false);

  const [imageError, setImageError] = useState(false);
  const [imageUrl, setImageUrl] = useState(
    item.imageUrl?.trim() ? item.imageUrl : null
  );

  const [itemRating, setItemRating] = useState(item.rating?.user || 0);
  const averageRating = item.rating?.average || 0;
  const totalRatings = item.rating?.rateCount || 0;

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

  const handleRatingChange = async (newRating) => {
    console.log("RATED AS:", newRating);
    rateItem(
      { postId: item._id, rating: newRating },
      {
        onSuccess: (res) => {
          console.log(res.data);
          setItemRating(res.data.userRating || 0);
          toast.success("Rating updated");
        },
      }
    );
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
              {averageRating} Avg. Rating
              <br />
              {totalRatings} Total ratings
            </Badge>
            <Badge bg="warning" text="dark"></Badge>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              minHeight: "40px",
            }}
          >
            <StarRatings
              rating={itemRating}
              starRatedColor="#ffd700"
              starEmptyColor="#444"
              changeRating={handleRatingChange}
              numberOfStars={5}
              starDimension="25px"
              starSpacing="2px"
            />
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
