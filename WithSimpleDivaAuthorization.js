import React, { Component } from 'react';
import PropTypes from 'prop-types';

import RequestAttributeDisclosure from './containers/RequestAttributeDisclosure/RequestAttributeDisclosure';

/**
 * React middleware function that renders based on available and required attribute.
 * @param {object} attributes - a key value object containing available attributes
 * @param {string} requiredAttribute - the attribute required
 * @param {string} requiredAttributeLabel - (optional) the label for the requiredAttribute
 * @returns {Component}
 */
export default function withSimpleDivaAuthorization(
  attributes = {},
  requiredAttribute,
  requiredAttributeLabel,
) {
  return (WrappedComponent) => {
    class WithSimpleAuthorization extends Component {
      constructor(props) {
        super(props);
        this.requiredAttributes = [{
          label: requiredAttributeLabel || requiredAttribute,
          attributes: [requiredAttribute],
        }];
      }

      render() {
        if (attributes[requiredAttribute]) {
          return <WrappedComponent />;
        }
        return <RequestAttributeDisclosure requiredAttributes={this.requiredAttributes} />;
      }
    }
    WithSimpleAuthorization.PropTypes = {
      attributes: PropTypes.object.isRequired,
      requiredAttribute: PropTypes.string.isRequired,
      requiredAttributeLabel: PropTypes.string,
    };
    return WithSimpleAuthorization;
  };
}
