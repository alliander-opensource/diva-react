import React, { Component } from 'react';
import PropTypes from 'prop-types';

import RequestAttributeDisclosure from './containers/RequestAttributeDisclosure/RequestAttributeDisclosure';

/**
 * React middleware function that renders based on required and available attributes.
 * @param {object} options - user attribute that is required to see the page.
 * @returns {Component}
 */
export default function withSimpleDivaAuthorization(attributes = [], requiredAttribute) {
  return (WrappedComponent) => {
    class WithSimpleAuthorization extends Component {
      static propTypes = {
        user: PropTypes.shape({
          isFetching: PropTypes.bool.isRequired,
          sessionId: PropTypes.string.isRequired,
          attributes: PropTypes.objectOf(PropTypes.array).isRequired,
        }),
      };

      constructor(props) {
        super(props);
        this.content = [{
          label: requiredAttribute,
          attributes: [requiredAttribute],
        }];
      }

      render() {
        if (attributes[requiredAttribute]) {
          return <WrappedComponent {...this.props} />;
        }
        return <RequestAttributeDisclosure requiredAttributes={this.content} />;
      }
    }
    return WithSimpleAuthorization;
  };
}
