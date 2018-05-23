import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flexbox-grid';
import RaisedButton from 'material-ui/RaisedButton';

const IssueCredentialsCancelled = ({ onRetry }) => (
  <div style={{ padding: '20px' }} id="issue-cancelled">
    <Row center="xs">
      <Col xs={6}>
        You cancelled credential issuance.<br />
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
  onRetry: PropTypes.func.isRequired,
};

export default IssueCredentialsCancelled;
