import { Container, Row, Col } from "react-bootstrap";
import { useLikedItemsQuery } from "../api/item";
import ItemCard from "../components/ItemCard";

const LikesScreen = () => {
  const { data: likedPosts, isLoading, error } = useLikedItemsQuery();
  if (isLoading) return <div>Loading...</div>;
  if (error)
    return (
      <Container className="mt-4">
        <div className="alert alert-danger">
          Error loading posts: {error.message}
        </div>
      </Container>
    );

  return (
    <Container className="mt-4">
      <Row>
        {likedPosts.data?.map((item) => (
          <Col md={4} key={item._id} className="mb-4">
            <ItemCard item={item} />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default LikesScreen;
