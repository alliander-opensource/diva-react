import React from 'react';
import { Row, Col } from 'react-flexbox-grid';
import IconActionCheckCircle from 'material-ui/svg-icons/action/check-circle';

// TODO: same component as RequestAttributeDisclosureDone, merge?
const SignDone = () => (
  <div id="sign-completed">
    <Row center="xs">
      <Col xs>
        <IconActionCheckCircle style={{ width: '100px', height: '100px', color: 'limegreen' }} />
      </Col>
    </Row>
    <Row center="xs">
      <Col xs={6}>
        Message signing successful!<br />
      </Col>
    </Row>
  </div>
);

export default SignDone;
