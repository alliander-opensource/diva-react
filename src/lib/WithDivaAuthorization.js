import React from 'react';

import RequestAttributeDisclosure from './containers/RequestAttributeDisclosure/RequestAttributeDisclosure';

function extractAttributeIds(attributes) {
  return attributes.map(el => el.id);
}

function hasRequiredAttributes(attributes, condiscon) {
  const existingAttributes = extractAttributeIds(attributes);

  return condiscon.every(
    discon => discon.some(
      con => con.every(
        attr => existingAttributes.includes(attr),
      ),
    ),
  );
}

/**
 * React middleware function that renders based on available and required attributes.
 * @param {object} attributes - a key value object containing available attributes
 * @param {array} requiredAttributes - an array containing required attributes with their label
 * @returns {Component}
 */
export default function withDivaAuthorization(attributes = {}, requiredAttributesCondiscon = [], label = '', viewId = 'diva-auth', qrOnly = false) {
  return WrappedComponent => (
    () => {
      if (hasRequiredAttributes(attributes, requiredAttributesCondiscon)) {
        return <WrappedComponent />;
      }
      return (
        <RequestAttributeDisclosure
          viewId={viewId}
          requiredAttributes={requiredAttributesCondiscon}
          label={label}
          qrOnly={qrOnly}
        />
      );
    }
  );
}
