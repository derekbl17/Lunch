import { Modal, Button, Form, Badge, ListGroup } from "react-bootstrap";
import { useState } from "react";
import { useAuth } from "../context/authContext";

const ItemModal = ({ show, onHide, post, img }) => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header className="bg-dark text-white" closeButton>
        <Modal.Title>{isEditing ? "Edit Post" : post.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-dark text-white">
        <img src={img} alt={post.name} className="img-fluid rounded mb-3" />
        <p>{parseFloat(post.price?.$numberDecimal).toFixed(2)} eur</p>
        <p className=" border-top border-white">{post.description}</p>
      </Modal.Body>
    </Modal>
  );
};

export default ItemModal;
