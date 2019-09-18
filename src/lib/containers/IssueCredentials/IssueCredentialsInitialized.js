import React from 'react';
import PropTypes from 'prop-types';
import QRCode from 'qrcode.react';
import { Row, Col } from 'react-flexbox-grid';

const IssueCredentialsInitialized = ({ credentials, qrContent, qrOnly }) => (
  qrOnly === true
    ? (
      <QRCode value={JSON.stringify(qrContent)} size={256} />
    ) : (
      <div style={{ padding: '20px' }}>
        <Row center="xs">
          <Col xs={6}>
            Credential(s) type: {JSON.stringify(credentials)}<br />
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
            Please scan the QR code with your IRMA app to receive the credentials.
            <br />
          </Col>
        </Row>
      </div>
    )
);

IssueCredentialsInitialized.propTypes = {
  credentials: PropTypes.arrayOf(PropTypes.string).isRequired,
  qrContent: PropTypes.objectOf(PropTypes.string).isRequired,
  qrOnly: PropTypes.bool,
};

export default IssueCredentialsInitialized;
