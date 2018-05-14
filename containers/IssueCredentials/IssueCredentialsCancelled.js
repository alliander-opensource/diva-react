import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flexbox-grid';
import RaisedButton from 'material-ui/RaisedButton';

const IssueCredentialsCancelled = ({ onRetry }) => (
  <div style={{ padding: '20px' }} id="issue-cancelled">
    <Row center="xs">
      <Col xs={6}>
        Je hebt het uitgeven van credentials geannuleerd.<br />
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

IssueCredentialsCancelled.propTypes = {
  onRetry: PropTypes.func,
};

export default IssueCredentialsCancelled;
