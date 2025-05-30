import { Container, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className=" py-5">
      <Container className="d-flex justify-content-center">
        <Card className="p-5 d-flex flex-column align-items-center hero-card bg-dark w-75 text-light border-warning">
          <h1 className="text-center mb-4">The Diner</h1>
          <p className="text-center mb-4">
            You must be logged in to view our menu
          </p>
          <div className="d-flex">
            <Button
              variant="outline-warning"
              as={Link}
              to="/login"
              className="me-3"
            >
              Sign In
            </Button>
            <Button variant="outline-warning" as={Link} to="/register">
              Register
            </Button>
          </div>
        </Card>
      </Container>
    </div>
  );
};

export default Hero;
