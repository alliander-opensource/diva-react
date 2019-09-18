import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flexbox-grid';
import Button from '@material-ui/core/Button';

const RequestAttributeDisclosureCancelled = ({ onRetry }) => (
  <div style={{ padding: '20px' }} id="disclosure-cancelled">
    <Row center="xs">
      <Col xs={6}>
        You cancelled attribute disclosure.<br />
        <br />
        <Button onClick={onRetry} color="primary" variant="contained">Retry</Button>
        <br />
      </Col>
    </Row>
  </div>
);

RequestAttributeDisclosureCancelled.propTypes = {
  onRetry: PropTypes.func.isRequired,
};

export default RequestAttributeDisclosureCancelled;
