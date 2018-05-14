import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flexbox-grid';
import CircularProgress from 'material-ui/CircularProgress';

import { actions } from '../../reducers/diva-reducer';

import IssueCredentialsToolbar from './IssueCredentialsToolbar';
import IssueCredentialsInitialized from './IssueCredentialsInitialized';
import IssueCredentialsConnected from './IssueCredentialsConnected';
import IssueCredentialsCancelled from './IssueCredentialsCancelled';
import IssueCredentialsDone from './IssueCredentialsDone';
import IssueCredentialsNotFound from './IssueCredentialsNotFound';
import IssueCredentialsError from './IssueCredentialsError';

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

            <IssueCredentialsToolbar />

            {(sessionStatus === 'INITIALIZED') && (
              <IssueCredentialsInitialized credentialType={credentialType} qrContent={qrContent} />
            )}

            {(sessionStatus === 'CONNECTED') && (
              <IssueCredentialsConnected />
            )}

          </div>
        )}

        {(sessionStatus === 'DONE' || sessionCompleted === true) && (
          <IssueCredentialsDone />
        )}

        {(sessionStatus === 'FAILED_TO_START') && (
          <IssueCredentialsError onRetry={() => this.startIrmaSession()} />
        )}

        {(sessionStatus === 'CANCELLED' || (sessionStatus === 'NOT_FOUND' && !sessionCompleted)) && (
          <div>
            <IssueCredentialsToolbar />

            {(sessionStatus === 'CANCELLED') && (
              <IssueCredentialsCancelled onRetry={() => this.startIrmaSession()} />
            )}

            {(sessionStatus === 'NOT_FOUND') && (
              <IssueCredentialsNotFound onRetry={() => this.startIrmaSession()} />
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
