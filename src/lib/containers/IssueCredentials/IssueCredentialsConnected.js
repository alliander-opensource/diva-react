import React from 'react';
import { Row, Col } from 'react-flexbox-grid';

const IssueCredentialsConnected = () => (
  <div style={{ padding: '20px' }} id="qr-scanned">
    <Row center="xs">
      <Col xs={6}>
        To continue, accept the credentials in your IRMA app.<br />
        <br />
      </Col>
    </Row>
  </div>
);

export default IssueCredentialsConnected;
