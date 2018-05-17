import React from 'react';
import PropTypes from 'prop-types';
import QRCode from 'qrcode.react';
import { Row, Col } from 'react-flexbox-grid';

const RequestAttributeDisclosureInitialized = ({ requiredAttributes, qrContent }) => (
  <div style={{ padding: '20px' }}>
    <Row center="xs">
      <Col xs={6}>
        In order to view this page, the following attributes are required:<br />
        <br />
        <b>{requiredAttributes.map(el => el.label).join(', ')}</b><br />
        <br />
      </Col>
    </Row>
    <Row center="xs">
      <Col xs>
        <QRCode value={JSON.stringify(qrContent)} size={256} /><br />
        <span style={{ display: 'none' }} id="qr-content">{JSON.stringify(qrContent)}</span>
        <br />
      </Col>
    </Row>
    <Row center="xs">
      <Col xs={6}>
        Please scan the QR code with your IRMA app to continue.
        <br />
      </Col>
    </Row>
  </div>
);

RequestAttributeDisclosureInitialized.propTypes = {
  requiredAttributes: PropTypes.array.isRequired,
  qrContent: PropTypes.object.isRequired,
};

export default RequestAttributeDisclosureInitialized;
