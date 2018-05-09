import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import QRCode from 'qrcode.react';
import { Row, Col } from 'react-flexbox-grid';
import axios from 'axios';
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
  constructor(props) {
    super(props);
    this.state = {
      issueStatus: 'PENDING',
      serverStatus: 'INITIALIZED',
      sessionStarted: false,
    };
  }

  componentDidMount() {
    this._isMounted = true;
    if (!this.state.sessionStarted) {
      console.log('starting session');
      this.props.startIrmaSession('ISSUE', { credentialType: this.props.credentialType });
      // this.fetchQR();
    }
  }

  // fetchQR = () => {
  //   const { credentialType } = this.props;
  //   this.setState({
  //     issueStatus: 'PENDING',
  //     serverStatus: 'INITIALIZED',
  //     sessionStarted: true,
  //   });
  //   axios
  //     .post('/api/start-irma-session', {
  //       type: 'ISSUE',
  //       credentialType,
  //     }, {
  //       withCredentials: true,
  //       headers: {
  //         'Accept': 'application/json',
  //         'Content-Type': 'application/json'
  //       },
  //     })
  //     .then(response => response.data)
  //     .then(data => {
  //       if (this._isMounted) {
  //         this.setState({
  //           qrContent: data.qrContent,
  //         });
  //         this.startPolling(data.irmaSessionId);
  //       }
  //     });
  // }

  startPolling = irmaSessionId => {
    const pollTimerId = setInterval(this.poll, 1000, irmaSessionId, this);
    this.setState({ pollTimerId });
  }

  stopPolling = () => {
    if (this.state.pollTimerId) {
      clearInterval(this.state.pollTimerId);
      this.setState({ pollTimerId: undefined });
    }
  }

  poll(irmaSessionId, self) {
    self
      .getIssueStatus(irmaSessionId)
      .then(result => {
        console.log(result);
        self.setState({
          issueStatus: result.issueStatus,
          serverStatus: result.serverStatus,
        });
        switch (result.issueStatus) {
          case 'COMPLETED':
            self.stopPolling();
            self.props.onComplete(result);
            break;
          case 'ABORTED':
            self.props.onFailure(result);
            self.stopPolling();
            break;
          default:
            break;
        }
      });
  }

  getIssueStatus(irmaSessionId) {
    return  axios
      .get(`/api/issue-status?irmaSessionId=${irmaSessionId}`, {
        withCredentials: true,
      })
      .then(response => response.data);
  }

  componentWillUnmount() {
    this._isMounted = false;
    this.stopPolling();
  }

  render() {
    const { credentialType } = this.props;
    const {
      qrContent,
      issueStatus,
      // proofStatus,
      serverStatus,
    } = this.state;

    return (
      <div>
        {qrContent ? (
          <div>

            {(issueStatus === 'PENDING') && (
              <div>

                <Toolbar style={{ backgroundColor: 'none' }}>
                  <ToolbarGroup>
                    <ToolbarTitle text='Attributen uitgeven' />
                  </ToolbarGroup>
                  <ToolbarGroup lastChild={true}>
                    <IconButton tooltip="Help">
                      <IconActionHelp/>
                    </IconButton>
                    <IconButton tooltip="Info">
                      <IconActionInfo/>
                    </IconButton>
                  </ToolbarGroup>
                </Toolbar>

                {(serverStatus === 'INITIALIZED') && (
                  <div style={{ padding: '20px' }}>
                    <Row center="xs">
                      <Col xs={6}>
                        Credential(s) type: {credentialType}
                        <br />
                      </Col>
                    </Row>
                    <Row center="xs">
                      <Col xs>
                        <QRCode value={JSON.stringify(qrContent)} size={256}/><br/>
                        <span style={{display: 'none'}} id="qr-content">{JSON.stringify(qrContent)}</span>
                        <br/>
                      </Col>
                    </Row>
                    <Row center="xs">
                      <Col xs={6}>
                        Scan de QR-code met de IRMA app om de credentials te ontvangen.
                        <br/>
                      </Col>
                    </Row>
                  </div>
                )}

                {(serverStatus === 'CONNECTED') && (
                  <div style={{ padding: '20px' }} id='qr-scanned'>
                    <Row center="xs">
                      <Col xs={6}>
                        Om verder te gaan, accepteerde credentials in IRMA-app.<br/>
                        <br/>
                      </Col>
                    </Row>
                  </div>
                )}

              </div>
            )}

            {(issueStatus === 'COMPLETED') && (
              <div>
                {(serverStatus === 'DONE') ? (
                  <div id='issuing-completed'>
                    <Row center="xs">
                      <Col xs>
                        <IconActionCheckCircle style={{ width: '100px', height: '100px', color: 'limegreen'}}/>
                      </Col>
                    </Row>
                    <Row center="xs">
                      <Col xs={6}>
                        Credentials succesvol uitgegeven!
                      </Col>
                    </Row>
                  </div>
                ) : (
                  <div id="issue-error">
                    <Row center="xs">
                      <Col xs>
                        <IconAlertError style={{ width: '100px', height: '100px', color: 'orangered'}}/>
                      </Col>
                    </Row>
                    <Row center="xs">
                      <Col xs={6}>
                        Er is iets misgegaan!<br/>
                        <br/>
                        <RaisedButton label="Retry"
                          primary={true} style={{}}
                          onClick={() => this.fetchQR()}/>
                      </Col>
                    </Row>
                  </div>
                )}
              </div>
            )}
            {(issueStatus === 'ABORTED') && (
              <div>
              <Toolbar style={{ backgroundColor: 'none' }}>
                <ToolbarGroup>
                  <ToolbarTitle text="Credentials uitgeven geannuleerd" />
                </ToolbarGroup>
                <ToolbarGroup lastChild={true}>
                  <IconButton tooltip="Help">
                    <IconActionHelp/>
                  </IconButton>
                  <IconButton tooltip="Info">
                    <IconActionInfo/>
                  </IconButton>
                </ToolbarGroup>
              </Toolbar>

                {(serverStatus === 'CANCELLED') && (
                  <div style={{ padding: '20px' }} id="issue-cancelled">
                    <Row center="xs">
                      <Col xs={6}>
                        Je hebt het uitgeven van credentials geannuleerd.<br/>
                        <br/>
                        <RaisedButton label="Retry"
                          primary={true} style={{}}
                          onClick={() => this.fetchQR()}/>
                        <br/>
                      </Col>
                    </Row>
                  </div>
                )}

                {(serverStatus === 'NOT_FOUND') && (
                  <div style={{ padding: '20px' }} id="qr-expired">
                    <Row center="xs">
                      <Col xs={6}>
                        De QR code is verlopen.<br/>
                        <br/>
                        <RaisedButton label="Retry"
                          primary={true} style={{}}
                          onClick={() => this.fetchQR()}/>
                        <br/>
                      </Col>
                    </Row>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div>
            <Row center="xs">
              <Col xs>
                <CircularProgress/>
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
  onComplete: PropTypes.func.isRequired,
  onFailure: PropTypes.func.isRequired,
}

const mapStateToProps = () => ({});

const mapDispatchToProps = {
  startIrmaSession: actions.startIrmaSession,
}

export default connect(mapStateToProps, mapDispatchToProps)(IssueCredentials);
