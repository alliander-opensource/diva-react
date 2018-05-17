import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flexbox-grid';
import RaisedButton from 'material-ui/RaisedButton';
import IconAlertError from 'material-ui/svg-icons/alert/error';

const RequestAttributeDisclosureError = ({ onRetry }) => (
  <div id="issue-error">
    <Row center="xs">
      <Col xs>
        <IconAlertError style={{ width: '100px', height: '100px', color: 'orangered' }} />
      </Col>
    </Row>
    <Row center="xs">
      <Col xs={6}>
      Oops, something went wrong!<br />
        <br />
        <RaisedButton
          label="Retry"
          primary
          onClick={onRetry}
        />
      </Col>
    </Row>
  </div>
);

RequestAttributeDisclosureError.propTypes = {
  onRetry: PropTypes.func.isRequired,
};

export default RequestAttributeDisclosureError;
