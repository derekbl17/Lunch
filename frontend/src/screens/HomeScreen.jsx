import Hero from "../components/Hero";
import { useAuth } from "../context/authContext";
import { useEffect, useMemo } from "react";
import { useItemsQuery } from "../api/item";
import { Container, Row, Col, Spinner, Alert } from "react-bootstrap";
import ItemCard from "../components/ItemCard";

const HomeScreen = () => {
  const { user } = useAuth();
  if (!user) return <Hero />;

  const {
    data: posts,
    isLoading: postsLoading,
    error: postsError,
  } = useItemsQuery();
  const { data: items, isLoading: itemsLoading } = useItemsQuery();

  if (postsLoading || itemsLoading) {
    return (
      <Container className="mt-4 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (postsError) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">
          Error loading posts: {postsError.message}
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Row xs={1} md={2} lg={3} className="g-4">
        {items?.map((item) => (
          <Col key={item._id}>
            <ItemCard item={item} />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default HomeScreen;
