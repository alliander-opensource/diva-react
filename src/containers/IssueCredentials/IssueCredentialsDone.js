import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flexbox-grid';
import IconActionCheckCircle from 'material-ui/svg-icons/action/check-circle';
import RaisedButton from 'material-ui/RaisedButton';

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
        <RaisedButton
          label="Opnieuw Uitgeven"
          primary
          onClick={onRetry}
        /><br />
        <br />
      </Col>
    </Row>
  </div>
);

IssueCredentialsDone.propTypes = {
  onRetry: PropTypes.func.isRequired,
};

export default IssueCredentialsDone;
