import { Card, Button, Badge, CardText } from "react-bootstrap";
import StarRatings from "react-star-ratings";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import { useEditItemMutation, useDeleteItemMutation } from "../api/item";
import Swal from "sweetalert2";

const AdminItemCard = ({ item }) => {
  const [editMode, setEditMode] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageUrl, setImageUrl] = useState(
    item.imageUrl?.trim() ? item.imageUrl : null
  );
  const { mutateAsync: updateItem } = useEditItemMutation();
  const { mutateAsync: deleteItem } = useDeleteItemMutation();

  const [itemRating, setItemRating] = useState(item.rating?.user || 0);
  const averageRating = item.rating?.average || 0;
  const totalRatings = item.rating?.rateCount || 0;

  const [itemData, setItemData] = useState({
    name: item.name,
    imageUrl: item.imageUrl,
    description: item.description,
    price: parseFloat(item.price?.$numberDecimal).toFixed(2),
  });

  const itemId = item._id;

  const handleChange = (field, value) => {
    setItemData((prev) => ({ ...prev, [field]: value }));
  };

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

  const handleDelete = async (e) => {
    e.preventDefault();

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });
    if (result.isConfirmed) {
      deleteItem(e.target.value);
      Swal.fire("Deleted!", "Item has been removed from the menu.", "success");
    }
  };

  const handleSave = async () => {
    updateItem(
      { itemId, itemData },
      {
        onSuccess: () => {
          toast.success("Item updated successfully");
          setEditMode(false);
        },
        onError: () => {
          toast.error("Failed to update item!");
        },
      }
    );
  };

  return (
    <>
      {editMode !== true ? (
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
              onClick={() => setEditMode(true)}
            >
              Edit item
            </Button>
            <Button
              value={item._id}
              variant="outline-danger"
              onClick={handleDelete}
            >
              Delete item
            </Button>
          </Card.Footer>
        </Card>
      ) : (
        <Card className="h-100 border-warning text-white bg-dark">
          <Card.Body className="d-flex flex-column gap-4">
            <div>
              <label className="d-block">Item name</label>
              <input
                className="w-100"
                type="text"
                value={itemData.name}
                onChange={(e) => handleChange("name", e.target.value)}
              />
            </div>
            <div>
              <label className="d-block">Image url</label>
              <textarea
                className="w-100 h-100"
                value={itemData.imageUrl}
                onChange={(e) => handleChange("imageUrl", e.target.value)}
              />
            </div>
            <div>
              <label className="d-block">Description</label>
              <textarea
                className="w-100 h-100"
                type="text"
                value={itemData.description}
                onChange={(e) => handleChange("description", e.target.value)}
              />
            </div>
            <div>
              <label className="d-block">price</label>
              <input
                className="w-100"
                type="number"
                value={itemData.price}
                onChange={(e) => handleChange("price", e.target.value)}
              />
            </div>
          </Card.Body>
          <Card.Footer className="d-flex justify-content-between">
            <Button
              variant="outline-warning"
              size="sm"
              className="me-2"
              onClick={handleSave}
            >
              Save changes
            </Button>
            <Button
              variant="outline-warning"
              size="sm"
              className="me-2"
              onClick={() => setEditMode(false)}
            >
              Cancel
            </Button>
          </Card.Footer>
        </Card>
      )}
    </>
  );
};

export default AdminItemCard;
