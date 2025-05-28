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
import ItemCard from "./ItemCard";

const PostsDisplay = () => {
  // Data fetching
  const {
    data: posts,
    isLoading: postsLoading,
    error: postsError,
  } = useItemsQuery();
  const { data: categories, isLoading: categoriesLoading } = useItemsQuery();

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

  if (postsLoading || categoriesLoading) {
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
      {/* Search & Filter Controls */}
      <div className="mb-4 p-3 bg-light rounded shadow-sm">
        <Row className="g-3">
          {/* Search Input */}
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
              <option value="all">All Categories</option>
              {categories?.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </Form.Select>
          </Col>
          {/* Price Range Filter */}
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
      </div>

      <Row xs={1} md={2} lg={3} className="g-4">
        {categories?.map((item) => (
          <Col key={item._id}>
            <ItemCard item={item} />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default PostsDisplay;
