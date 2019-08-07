import withDivaAuthorization from './WithDivaAuthorization';

/**
 * React middleware function that renders based on available and required attribute.
 * @param {object} attributes - a key value object containing available attributes
 * @param {array<string>} requiredAttributes - the list of attributes required
 * @returns {Component}
 */
export default function withSimpleDivaAuthorization(
  attributes = {},
  requiredAttributes,
  label = '',
  viewId = 'simple-diva-auth',
  qrOnly = false,
) {
  return WrappedComponent =>
    withDivaAuthorization(
      attributes, [[requiredAttributes]], label, viewId, qrOnly,
    )(WrappedComponent);
}
