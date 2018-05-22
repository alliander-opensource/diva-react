import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { Row, Col } from 'react-flexbox-grid';
import CircularProgress from 'material-ui/CircularProgress';

import { actions } from '../../reducers/diva-reducer';

import SignToolbar from './SignToolbar';
import SignInitialized from './SignInitialized';
import SignConnected from './SignConnected';
import SignCancelled from './SignCancelled';
import SignDone from './SignDone';
import SignNotFound from './SignNotFound';
import SignError from './SignError';

class Sign extends Component {
  componentDidMount() {
    // TODO: this can be refactored out of here if
    // it becomes something like startOrResumeDivaSession(viewId)
    if (!this.props.divaSession || this.props.divaSession.sessionStatus === 'ABANDONED') {
      this.startIrmaSession();
    }
  }

  componentWillUnmount() {
    this.props.abandonIrmaSession(this.props.viewId, this.props.divaSession.irmaSessionId);
  }

  startIrmaSession() {
    const { viewId, message } = this.props;
    this.props.startIrmaSession(viewId, 'SIGN', { attributesRequired: this.props.requiredAttributes, message });
  }

  render() {
    const {
      requiredAttributes,
      message,
      divaSession,
    } = this.props;

    return (
      <div>
        <SignToolbar />

        {divaSession && divaSession.sessionStatus !== 'STARTING' ? (
          <div>
            {(divaSession.sessionStatus === 'FAILED_TO_START') && <SignError onRetry={() => this.startIrmaSession()} /> }

            {(divaSession.sessionStatus === 'INITIALIZED') && <SignInitialized requiredAttributes={requiredAttributes} qrContent={divaSession.qrContent} message={message} /> }
            {(divaSession.sessionStatus === 'CONNECTED') && <SignConnected /> }
            {(divaSession.sessionStatus === 'DONE' && divaSession.proofStatus === 'VALID') && <SignDone /> }
            {(divaSession.sessionStatus === 'DONE' && divaSession.proofStatus !== 'VALID') && <SignNotFound onRetry={() => this.startIrmaSession()} /> }
            {(divaSession.sessionStatus === 'CANCELLED' || divaSession.sessionStatus === 'ABANDONED') && <SignCancelled onRetry={() => this.startIrmaSession()} /> }
            {(divaSession.sessionStatus === 'NOT_FOUND') && <SignNotFound onRetry={() => this.startIrmaSession()} /> }
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

Sign.propTypes = {
  viewId: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  requiredAttributes: PropTypes.arrayOf(PropTypes.object).isRequired,
  startIrmaSession: PropTypes.func.isRequired,
  abandonIrmaSession: PropTypes.func.isRequired,
  divaSession: PropTypes.shape({
    isPolling: PropTypes.bool,
    started: PropTypes.bool,
    irmaSessionType: PropTypes.string,
    qrContent: PropTypes.objectOf(PropTypes.string),
    irmaSessionId: PropTypes.string,
    sessionStatus: PropTypes.string,
    proofStatus: PropTypes.string,
  }),
};

const mapStateToProps = (state, ownProps) =>
  ({ divaSession: state.diva.sessions[ownProps.viewId] });

const mapDispatchToProps = {
  startIrmaSession: actions.startIrmaSession,
  abandonIrmaSession: actions.abandonIrmaSession,
};

export default connect(mapStateToProps, mapDispatchToProps)(Sign);
