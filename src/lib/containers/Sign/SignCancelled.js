import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flexbox-grid';
import Button from '@material-ui/core/Button';

const SignCancelled = ({ onRetry }) => (
  <div style={{ padding: '20px' }} id="sign-cancelled">
    <Row center="xs">
      <Col xs={6}>
        You cancelled signing of the message.<br />
        <br />
        <Button onClick={onRetry} color="primary" variant="contained">Retry</Button>
        <br />
      </Col>
    </Row>
  </div>
);

SignCancelled.propTypes = {
  onRetry: PropTypes.func.isRequired,
};

export default SignCancelled;
