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
    // Needed because component might re-mount after completing session
    if (!this.props.sessionCompleted) {
      this.startIrmaSession();
    }
  }

  componentWillUnmount() {
    this.props.cancelIrmaSession(this.props.irmaSessionId);
  }

  startIrmaSession() {
    this.props.startIrmaSession('DISCLOSE', { attributesRequired: this.props.requiredAttributes });
  }

  render() {
    const {
      qrContent,
      requiredAttributes,
      sessionStatus,
      sessionCompleted,
    } = this.props;

    return (
      <div>
        <RequestAttributeDisclosureToolbar />

        {(sessionStatus === null) && (
          <div>
            <Row center="xs">
              <Col xs>
                <CircularProgress />
              </Col>
            </Row>
          </div>
        )}

        {(sessionStatus === 'FAILED_TO_START') && <RequestAttributeDisclosureError onRetry={() => this.startIrmaSession()} /> }

        {(sessionStatus === 'INITIALIZED') && <RequestAttributeDisclosureInitialized requiredAttributes={requiredAttributes} qrContent={qrContent} /> }
        {(sessionStatus === 'CONNECTED') && <RequestAttributeDisclosureConnected /> }
        {(sessionStatus === 'DONE' || sessionCompleted === true) && <RequestAttributeDisclosureDone /> }
        {(sessionStatus === 'CANCELLED') && <RequestAttributeDisclosureCancelled onRetry={() => this.startIrmaSession()} /> }
        {(sessionStatus === 'NOT_FOUND' && !sessionCompleted) && <RequestAttributeDisclosureNotFound onRetry={() => this.startIrmaSession()} /> }
      </div>
    );
  }
}

RequestAttributeDisclosure.propTypes = {
  requiredAttributes: PropTypes.array.isRequired,
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

export default connect(mapStateToProps, mapDispatchToProps)(RequestAttributeDisclosure);
