import React, { Component } from 'react';

import RequestAttributeDisclosure from './containers/RequestAttributeDisclosure/RequestAttributeDisclosure';

/**
 * React middleware function that renders based on available and required attributes.
 * @param {object} attributes - a key value object containing available attributes
 * @param {array} requiredAttributes - an array containing required attributes with their label
 * @returns {Component}
 */
export default function withDivaAuthorization(attributes = {}, requiredAttributes = []) {
  return (WrappedComponent) => {
    class WithAuthorization extends Component {
      hasRequiredAttributes = () => {
        const existingAttributes = Object.keys(attributes);
        return requiredAttributes.reduce(
          (accumulator, requiredAttribute) =>
            accumulator && requiredAttribute.attributes.some(el => existingAttributes.includes(el)),
          true,
        );
      }

      render() {
        if (this.hasRequiredAttributes(attributes, requiredAttributes)) {
          return <WrappedComponent />;
        }
        return <RequestAttributeDisclosure requiredAttributes={requiredAttributes} />;
      }
    }
    return WithAuthorization;
  };
}
