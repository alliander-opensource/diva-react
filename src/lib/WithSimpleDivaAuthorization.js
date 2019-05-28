import withDivaAuthorization from './WithDivaAuthorization';

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
  viewId = 'simple-diva-auth',
  qrOnly = false,
) {
  return (WrappedComponent) => {
    const requiredAttributes = [{
      label: requiredAttributeLabel || requiredAttribute,
      attributes: [requiredAttribute],
    }];
    return withDivaAuthorization(attributes, requiredAttributes, viewId, qrOnly)(WrappedComponent);
  };
}
