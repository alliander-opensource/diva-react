import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flexbox-grid';
import RaisedButton from 'material-ui/RaisedButton';

const RequestAttributeDisclosureNotFound = ({ onRetry }) => (
  <div style={{ padding: '20px' }} id="qr-expired">
    <Row center="xs">
      <Col xs={6}>
        The QR code expired.<br />
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

RequestAttributeDisclosureNotFound.propTypes = {
  onRetry: PropTypes.func.isRequired,
};

export default RequestAttributeDisclosureNotFound;
