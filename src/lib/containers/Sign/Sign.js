import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { Row, Col } from 'react-flexbox-grid';
import CircularProgress from '@material-ui/core/CircularProgress';

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
    // TODO: check properly for divaSession
    if (!this.props.divaSession || Object.keys(this.props.divaSession).length === 0 || this.props.divaSession.sessionStatus === 'ABANDONED') {
      this.startIrmaSession();
    }
  }

  componentWillUnmount() {
    this.props.abandonIrmaSession(this.props.viewId, this.props.divaSession.irmaSessionId);
  }

  startIrmaSession() {
    const { viewId, message } = this.props;
    this.props.startIrmaSession(viewId, 'signing', this.props.requiredAttributes, message);
  }

  render() {
    const {
      requiredAttributes,
      message,
      divaSession,
      qrOnly,
    } = this.props;

    return (
      <div>
        {qrOnly !== true ? <SignToolbar /> : undefined}

        {divaSession && divaSession.sessionStatus !== 'STARTING' ? (
          <div>
            {(divaSession.sessionStatus === 'FAILED_TO_START') && <SignError onRetry={() => this.startIrmaSession()} /> }

            {(divaSession.sessionStatus === 'INITIALIZED') && <SignInitialized requiredAttributes={requiredAttributes} qrContent={divaSession.qrContent} message={message} qrOnly={qrOnly} /> }
            {(divaSession.sessionStatus === 'CONNECTED') && <SignConnected /> }
            {(divaSession.sessionStatus === 'DONE' && divaSession.proofStatus === 'VALID') && <SignDone attributes={divaSession.disclosedAttributes} jwt={divaSession.jwt} signature={divaSession.signature.signature} message={message} /> }
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
  qrOnly: PropTypes.bool,
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
    jwt: PropTypes.string,
    signature: PropTypes.object,
    disclosedAttributes: PropTypes.array,
  }),
};

const mapStateToProps = (state, ownProps) =>
  ({ divaSession: state.divaReducer.sessions[ownProps.viewId] });

const mapDispatchToProps = {
  startIrmaSession: actions.startIrmaSession,
  abandonIrmaSession: actions.abandonIrmaSession,
};

export default connect(mapStateToProps, mapDispatchToProps)(Sign);
