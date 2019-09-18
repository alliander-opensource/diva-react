import React from 'react';
import PropTypes from 'prop-types';
import QRCode from 'qrcode.react';
import { Row, Col } from 'react-flexbox-grid';

const SignInitialized = ({ label, message, qrContent, qrOnly }) => (
  qrOnly === true
    ? (
      <QRCode value={JSON.stringify(qrContent)} size={256} />
    ) : (
      <div style={{ padding: '20px' }}>
        <Row center="xs">
          <Col xs={6}>
            Message that will be signed: <b>{message}</b><br />
            <br />
            With the following attributes:<br />
            <b>{label}</b><br />
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
            Please scan the QR code with your IRMA app to sign the message.
            <br />
          </Col>
        </Row>
      </div>
    )
);

SignInitialized.propTypes = {
  label: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  qrContent: PropTypes.objectOf(PropTypes.string).isRequired,
  qrOnly: PropTypes.bool,
};

export default SignInitialized;
