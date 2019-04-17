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
    // TODO: this can be refactored out of here if
    // it becomes something like startOrResumeDivaSession(viewId)
    // TODO: check properly for divaSession
    if (!this.props.divaSession || Object.keys(this.props.divaSession).length === 0 || this.props.divaSession.sessionStatus === 'ABANDONED') {
      this.startIrmaSession();
    }
  }

  componentWillUnmount() {
    this.props.abandonIrmaSession(this.props.viewId, this.props.divaSession.irmaSessionId);
  }

  startIrmaSession() {
    this.props.startIrmaSession(this.props.viewId, 'issuing', undefined, undefined, this.props.credentials); // TODO: other function call instead of empty params?
  }

  render() {
    const {
      credentials,
      divaSession,
    } = this.props;

    return (
      <div>
        <IssueCredentialsToolbar />

        {divaSession && divaSession.sessionStatus !== 'STARTING' ? (
          <div>
            {(divaSession.sessionStatus === 'FAILED_TO_START') && <IssueCredentialsError onRetry={() => this.startIrmaSession()} /> }

            {(divaSession.sessionStatus === 'INITIALIZED') && <IssueCredentialsInitialized credentials={credentials.map(el => el.credential)} qrContent={divaSession.qrContent} /> }
            {(divaSession.sessionStatus === 'CONNECTED') && <IssueCredentialsConnected /> }
            {(divaSession.sessionStatus === 'DONE') && <IssueCredentialsDone onRetry={() => this.startIrmaSession()} /> }
            {(divaSession.sessionStatus === 'CANCELLED' || divaSession.sessionStatus === 'ABANDONED') && <IssueCredentialsCancelled onRetry={() => this.startIrmaSession()} /> }
            {(divaSession.sessionStatus === 'NOT_FOUND') && <IssueCredentialsNotFound onRetry={() => this.startIrmaSession()} /> }
          </div>
        ) : (
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
  viewId: PropTypes.string.isRequired,
  credentials: PropTypes.arrayOf(PropTypes.object).isRequired,
  startIrmaSession: PropTypes.func.isRequired,
  abandonIrmaSession: PropTypes.func.isRequired,
  divaSession: PropTypes.shape({
    isPolling: PropTypes.bool,
    started: PropTypes.bool,
    irmaSessionType: PropTypes.string,
    qrContent: PropTypes.objectOf(PropTypes.string),
    irmaSessionId: PropTypes.string,
    sessionStatus: PropTypes.string,
  }),
};

const mapStateToProps = (state, ownProps) =>
  ({ divaSession: state.divaReducer.sessions[ownProps.viewId] });

const mapDispatchToProps = {
  startIrmaSession: actions.startIrmaSession,
  abandonIrmaSession: actions.abandonIrmaSession,
};

export default connect(mapStateToProps, mapDispatchToProps)(IssueCredentials);
