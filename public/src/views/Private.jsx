import React from "react";
import { Container, Row, Col } from "reactstrap";

const Private = () => {
  return (
    <Container className="mb-5">
      <Row className="align-items-center profile-header mb-5 text-center text-md-left">
        <Col md={6}>
          <span>okay, you have permissiont to get here</span>
        </Col>
      </Row>
    </Container>
  );
};

export default Private;
