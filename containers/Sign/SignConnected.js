import React from 'react';
import { Row, Col } from 'react-flexbox-grid';

const SignConnected = () => (
  <div style={{ padding: '20px' }} id="qr-scanned">
    <Row center="xs">
      <Col xs={6}>
        To continue, approve signing of the message with your IRMA app.<br />
        <br />
      </Col>
    </Row>
  </div>
);

export default SignConnected;
