import React from 'react';
import { Row, Col } from 'react-flexbox-grid';

const IssueCredentialsConnected = () => (
  <div style={{ padding: '20px' }} id="qr-scanned">
    <Row center="xs">
      <Col xs={6}>
        Om verder te gaan, accepteer de credentials in IRMA-app.<br />
        <br />
      </Col>
    </Row>
  </div>
);

export default IssueCredentialsConnected;
