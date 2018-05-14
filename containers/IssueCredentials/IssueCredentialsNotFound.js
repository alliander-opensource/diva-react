import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flexbox-grid';
import RaisedButton from 'material-ui/RaisedButton';

const IssueCredentialsNotFound = ({ onRetry }) => (
  <div style={{ padding: '20px' }} id="qr-expired">
    <Row center="xs">
      <Col xs={6}>
        De QR code is verlopen.<br />
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

IssueCredentialsNotFound.propTypes = {
  onRetry: PropTypes.func,
};

export default IssueCredentialsNotFound;
