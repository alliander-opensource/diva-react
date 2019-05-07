import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flexbox-grid';
import IconActionCheckCircle from '@material-ui/icons/CheckCircle';
import Button from '@material-ui/core/Button';

const IssueCredentialsDone = ({ onRetry }) => (
  <div id="issuing-completed">
    <Row center="xs">
      <Col xs>
        <IconActionCheckCircle style={{ width: '100px', height: '100px', color: 'limegreen' }} />
      </Col>
    </Row>
    <Row center="xs">
      <Col xs={6}>
        Credentials successfully issued!<br />
        <br />
        <Button onClick={onRetry} color="primary" variant="contained">Opnieuw Uitgeven</Button><br />
        <br />
      </Col>
    </Row>
  </div>
);

IssueCredentialsDone.propTypes = {
  onRetry: PropTypes.func.isRequired,
};

export default IssueCredentialsDone;
