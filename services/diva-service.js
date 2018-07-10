import axios from 'axios';

const baseUrl = `${window.env.baseUrl}/api`;

function startIrmaSession(irmaSessionType, options) {
  // TODO: send options and parse in backend based on type?
  // only properties that are passed to the service will actually be included in the request
  return axios
    .post(`${baseUrl}/start-irma-session`, {
      type: irmaSessionType,
      content: options.attributesRequired,
      message: options.message,
      credentialType: options.credentialType,
    }, {
      withCredentials: true,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    })
    .then(response => response.data);
}

function poll(irmaSessionType, irmaSessionId) {
  return axios
    .get(`${baseUrl}/irma-session-status?irmaSessionType=${irmaSessionType}&irmaSessionId=${irmaSessionId}`, {
      withCredentials: true,
    })
    .then(response => response.data);
}

const service = {
  startIrmaSession,
  poll,
};

export default service;
