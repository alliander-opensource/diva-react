import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flexbox-grid';
import Button from '@material-ui/core/Button';

// TODO: same component as RequestAttributeDisclosureNotFound, merge?
const SignNotFound = ({ onRetry }) => (
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

SignNotFound.propTypes = {
  onRetry: PropTypes.func.isRequired,
};

export default SignNotFound;
