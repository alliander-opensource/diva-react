import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import QRCode from 'qrcode.react';
import { Row, Col } from 'react-flexbox-grid';

import RaisedButton from 'material-ui/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress';
import IconActionCheckCircle from 'material-ui/svg-icons/action/check-circle';
import IconActionHelp from 'material-ui/svg-icons/action/help';
import IconActionInfo from 'material-ui/svg-icons/action/info';
import IconAlertError from 'material-ui/svg-icons/alert/error';

import IconButton from 'material-ui/IconButton';
import { Toolbar, ToolbarGroup, ToolbarTitle } from 'material-ui/Toolbar';

import { actions } from '../../reducers/diva-reducer';

class IssueCredentials extends Component {
  componentDidMount() {
    this.startIrmaSession();
  }

  componentWillUnmount() {
    this.props.cancelIrmaSession(this.props.irmaSessionId);
  }

  startIrmaSession() {
    this.props.startIrmaSession('ISSUE', { credentialType: this.props.credentialType });
  }

  render() {
    const {
      qrContent,
      credentialType,
      sessionStatus,
      sessionCompleted,
    } = this.props;

    return (
      <div>

        {(sessionStatus === 'INITIALIZED' || sessionStatus === 'CONNECTED') && (
          <div>

            <Toolbar style={{ backgroundColor: 'none' }}>
              <ToolbarGroup>
                <ToolbarTitle text="Attributen uitgeven" />
              </ToolbarGroup>
              <ToolbarGroup lastChild>
                <IconButton tooltip="Help">
                  <IconActionHelp />
                </IconButton>
                <IconButton tooltip="Info">
                  <IconActionInfo />
                </IconButton>
              </ToolbarGroup>
            </Toolbar>

            {(sessionStatus === 'INITIALIZED') && (
              <div style={{ padding: '20px' }}>
                <Row center="xs">
                  <Col xs={6}>
                    Credential(s) type: {credentialType}
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
                    Scan de QR-code met de IRMA app om de credentials te ontvangen.
                    <br />
                  </Col>
                </Row>
              </div>
            )}

            {(sessionStatus === 'CONNECTED') && (
              <div style={{ padding: '20px' }} id="qr-scanned">
                <Row center="xs">
                  <Col xs={6}>
                    Om verder te gaan, accepteer de credentials in IRMA-app.<br />
                    <br />
                  </Col>
                </Row>
              </div>
            )}

          </div>
        )}

        {(sessionStatus === 'DONE' || sessionCompleted === true) && (
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
        )}

        {(sessionStatus === 'FAILED_TO_START') && (
          <div id="issue-error">
            <Row center="xs">
              <Col xs>
                <IconAlertError style={{ width: '100px', height: '100px', color: 'orangered' }} />
              </Col>
            </Row>
            <Row center="xs">
              <Col xs={6}>
                Er is iets misgegaan!<br />
                <br />
                <RaisedButton
                  label="Retry"
                  primary
                  onClick={() => this.startIrmaSession()}
                />
              </Col>
            </Row>
          </div>
        )}

        {(sessionStatus === 'CANCELLED' || (sessionStatus === 'NOT_FOUND' && !sessionCompleted)) && (
          <div>
            <Toolbar style={{ backgroundColor: 'none' }}>
              <ToolbarGroup>
                <ToolbarTitle text="Credentials uitgeven geannuleerd" />
              </ToolbarGroup>
              <ToolbarGroup lastChild>
                <IconButton tooltip="Help">
                  <IconActionHelp />
                </IconButton>
                <IconButton tooltip="Info">
                  <IconActionInfo />
                </IconButton>
              </ToolbarGroup>
            </Toolbar>

            {(sessionStatus === 'CANCELLED') && (
              <div style={{ padding: '20px' }} id="issue-cancelled">
                <Row center="xs">
                  <Col xs={6}>
                    Je hebt het uitgeven van credentials geannuleerd.<br />
                    <br />
                    <RaisedButton
                      label="Retry"
                      primary
                      onClick={() => this.startIrmaSession()}
                    />
                    <br />
                  </Col>
                </Row>
              </div>
            )}

            {(sessionStatus === 'NOT_FOUND') && (
              <div style={{ padding: '20px' }} id="qr-expired">
                <Row center="xs">
                  <Col xs={6}>
                    De QR code is verlopen.<br />
                    <br />
                    <RaisedButton
                      label="Retry"
                      primary
                      onClick={() => this.startIrmaSession()}
                    />
                    <br />
                  </Col>
                </Row>
              </div>
            )}
          </div>
        )}

        {(sessionStatus === null) && (
          <div>
            <Row center="xs">
              <Col xs>
                <CircularProgress />
              </Col>
            </Row>
          </div>
        )}
      </div>
    );
  }
}

IssueCredentials.propTypes = {
  credentialType: PropTypes.string.isRequired,
  startIrmaSession: PropTypes.func.isRequired,
  cancelIrmaSession: PropTypes.func.isRequired,
  qrContent: PropTypes.object,
  irmaSessionId: PropTypes.string,
  sessionStatus: PropTypes.string,
  sessionCompleted: PropTypes.bool,
};

const mapStateToProps = state => state.diva;

const mapDispatchToProps = {
  startIrmaSession: actions.startIrmaSession,
  cancelIrmaSession: actions.cancelIrmaSession,
};

export default connect(mapStateToProps, mapDispatchToProps)(IssueCredentials);
