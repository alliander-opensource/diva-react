import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flexbox-grid';
import Button from '@material-ui/core/Button';

const IssueCredentialsCancelled = ({ onRetry }) => (
  <div style={{ padding: '20px' }} id="issue-cancelled">
    <Row center="xs">
      <Col xs={6}>
        Issuance of credentials was cancelled.<br />
        <br />
        <Button onClick={onRetry} color="primary" variant="contained">Retry</Button>
        <br />
      </Col>
    </Row>
  </div>
);

IssueCredentialsCancelled.propTypes = {
  onRetry: PropTypes.func.isRequired,
};

export default IssueCredentialsCancelled;
