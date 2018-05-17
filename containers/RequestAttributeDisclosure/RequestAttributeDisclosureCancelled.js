import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flexbox-grid';
import RaisedButton from 'material-ui/RaisedButton';

const RequestAttributeDisclosureCancelled = ({ onRetry }) => (
  <div style={{ padding: '20px' }} id="disclosure-cancelled">
    <Row center="xs">
      <Col xs={6}>
        You cancelled attribute disclosure.<br />
        <br />
        <RaisedButton
          label="Retry"
          primary
          onClick={onRetry}
        />
        <br />
      </Col>
    </Row>
  </div>
);

RequestAttributeDisclosureCancelled.propTypes = {
  onRetry: PropTypes.func.isRequired,
};

export default RequestAttributeDisclosureCancelled;
