import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flexbox-grid';
import Button from '@material-ui/core/Button';

const IssueCredentialsNotFound = ({ onRetry }) => (
  <div style={{ padding: '20px' }} id="qr-expired">
    <Row center="xs">
      <Col xs={6}>
        The QR code expired.<br />
        <br />
        <Button onClick={onRetry} color="primary" variant="contained">Retry</Button>
        <br />
      </Col>
    </Row>
  </div>
);

IssueCredentialsNotFound.propTypes = {
  onRetry: PropTypes.func.isRequired,
};

export default IssueCredentialsNotFound;
