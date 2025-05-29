import Hero from "../components/Hero";
import { useAuth } from "../context/authContext";
import { useState, useEffect, useMemo } from "react";
import { useItemsQuery } from "../api/item";
import {
  Container,
  Row,
  Col,
  Form,
  InputGroup,
  Button,
  Spinner,
  Alert,
} from "react-bootstrap";
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

  // State for filters
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [filteredPosts, setFilteredPosts] = useState([]);

  const maxPrice = useMemo(() => {
    if (!posts?.data) return 100; // Default fallback

    return (
      Math.ceil(
        Math.max(
          ...posts.data.map((post) =>
            parseFloat(post.price?.$numberDecimal || post.price || 0)
          )
        )
      ) + 10
    ); // Add buffer
  }, [posts]);

  // Initialize price range when maxPrice is calculated
  useEffect(() => {
    setPriceRange([0, maxPrice]);
  }, [maxPrice]);

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
      {/* <div className="mb-4 p-3 bg-light rounded shadow-sm text-dark">
        <Row className="g-3">

          <Col md={6}>
            <InputGroup>
              <Form.Control
                type="search"
                placeholder="Search posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Search posts"
              />
              <Button variant="primary">
                <i className="fas fa-search"></i>
              </Button>
            </InputGroup>
          </Col>
          Category Filter
          <Col md={3}>
            <Form.Select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              aria-label="Filter by category"
            >
              <option value="all">All items</option>
              {items?.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </Form.Select>
          </Col>
          <Col md={3}>
            <Form.Label className="text-dark">
              Price: ${priceRange[0]} - ${priceRange[1]}
            </Form.Label>
            <Form.Range
              min={0}
              max={maxPrice}
              step={1}
              value={priceRange[1]}
              onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
            />
          </Col>
        </Row>
      </div> */}

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
