import React, { Component } from 'react';
import PropTypes from 'prop-types';

import RequestAttributeDisclosure from './containers/RequestAttributeDisclosure/RequestAttributeDisclosure';

/**
 * React middleware function that renders based on required and available attributes.
 * @param {object} options - options for the
 * @returns {Component}
 */
export default function withDivaAuthorization(options) {
  // TODO options parsing
  const attributes = options.attributes || [];
  const requiredAttributes = options.requiredAttributes || [];

  return (WrappedComponent) => {
    class WithAuthorization extends Component {
      static propTypes = {
        user: PropTypes.shape({
          isFetching: PropTypes.bool.isRequired,
          sessionId: PropTypes.string.isRequired,
          attributes: PropTypes.objectOf(PropTypes.array).isRequired,
        }),
      };

      hasRequiredAttributes = (attributes, requiredAttributes) => {
        const existingAttributes = Object.keys(attributes);
        return requiredAttributes.reduce(
          (accumulator, attributeGroup) =>
            accumulator && attributeGroup.attributes.some(el => existingAttributes.includes(el)),
          true,
        );
      }

      render() {
        if (this.hasRequiredAttributes(attributes, requiredAttributes)) {
          return <WrappedComponent {...this.props} />;
        }
        return <RequestAttributeDisclosure requiredAttributes={requiredAttributes} />;
      }
    }
    return WithAuthorization;
  };
}
