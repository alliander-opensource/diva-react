import React from 'react';
import { Row, Col } from 'react-flexbox-grid';
import IconActionCheckCircle from 'material-ui/svg-icons/action/check-circle';

const IssueCredentialsDone = () => (
  <div id="issuing-completed">
    <Row center="xs">
      <Col xs>
        <IconActionCheckCircle style={{ width: '100px', height: '100px', color: 'limegreen' }} />
      </Col>
    </Row>
    <Row center="xs">
      <Col xs={6}>
        Credentials succesvol uitgegeven!
      </Col>
    </Row>
  </div>
);

export default IssueCredentialsDone;
