import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { Row, Col } from 'react-flexbox-grid';
import CircularProgress from 'material-ui/CircularProgress';

import { actions } from '../../reducers/diva-reducer';

import RequestAttributeDisclosureToolbar from './RequestAttributeDisclosureToolbar';
import RequestAttributeDisclosureInitialized from './RequestAttributeDisclosureInitialized';
import RequestAttributeDisclosureConnected from './RequestAttributeDisclosureConnected';
import RequestAttributeDisclosureCancelled from './RequestAttributeDisclosureCancelled';
import RequestAttributeDisclosureDone from './RequestAttributeDisclosureDone';
import RequestAttributeDisclosureNotFound from './RequestAttributeDisclosureNotFound';
import RequestAttributeDisclosureError from './RequestAttributeDisclosureError';

class RequestAttributeDisclosure extends Component {
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
    this.props.startIrmaSession(this.props.viewId, 'DISCLOSE', { attributesRequired: this.props.requiredAttributes });
  }

  render() {
    const {
      requiredAttributes,
      divaSession,
    } = this.props;

    return (
      <div>
        <RequestAttributeDisclosureToolbar />

        {divaSession && divaSession.sessionStatus !== 'STARTING' ? (
          <div>
            {(divaSession.sessionStatus === 'FAILED_TO_START') && <RequestAttributeDisclosureError onRetry={() => this.startIrmaSession()} /> }

            {(divaSession.sessionStatus === 'INITIALIZED') && <RequestAttributeDisclosureInitialized requiredAttributes={requiredAttributes} qrContent={divaSession.qrContent} /> }
            {(divaSession.sessionStatus === 'CONNECTED') && <RequestAttributeDisclosureConnected /> }
            {(divaSession.sessionStatus === 'DONE' && divaSession.proofStatus === 'VALID') && <RequestAttributeDisclosureDone /> }
            {(divaSession.sessionStatus === 'DONE' && divaSession.proofStatus !== 'INVALID') && <RequestAttributeDisclosureNotFound onRetry={() => this.startIrmaSession()} /> }
            {(divaSession.sessionStatus === 'CANCELLED' || divaSession.sessionStatus === 'ABANDONED') && <RequestAttributeDisclosureCancelled onRetry={() => this.startIrmaSession()} /> }
            {(divaSession.sessionStatus === 'NOT_FOUND') && <RequestAttributeDisclosureNotFound onRetry={() => this.startIrmaSession()} /> }
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

RequestAttributeDisclosure.propTypes = {
  viewId: PropTypes.string.isRequired,
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

export default connect(mapStateToProps, mapDispatchToProps)(RequestAttributeDisclosure);
