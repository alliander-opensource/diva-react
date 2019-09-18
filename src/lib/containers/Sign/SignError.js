import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flexbox-grid';
import Button from '@material-ui/core/Button';
import IconAlertError from '@material-ui/icons/Error';

const SignError = ({ onRetry }) => (
  <div id="sign-error">
    <Row center="xs">
      <Col xs>
        <IconAlertError style={{ width: '100px', height: '100px', color: 'orangered' }} />
      </Col>
    </Row>
    <Row center="xs">
      <Col xs={6}>
      Oops, something went wrong!<br />
        <br />
        <Button onClick={onRetry} color="primary" variant="contained">Retry</Button>
      </Col>
    </Row>
  </div>
);

SignError.propTypes = {
  onRetry: PropTypes.func.isRequired,
};

export default SignError;
