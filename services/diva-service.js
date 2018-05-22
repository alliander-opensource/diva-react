import axios from 'axios';

function startIrmaSession(irmaSessionType, options) {
  // TODO: send options and parse in backend based on type?
  return axios
    .post('/api/start-irma-session', {
      type: irmaSessionType,
      content: options.attributesRequired,
      message: options.message, // if options.message is undefined, field won't be included in body
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
  // TODO: a more elegant solution that uses one endpoint
  switch (irmaSessionType) {
    case 'ISSUE':
      return axios
        .get(`/api/issue-status?irmaSessionId=${irmaSessionId}`, {
          withCredentials: true,
        })
        .then(response => response.data);

    case 'DISCLOSE':
      return axios
        .get(`/api/disclosure-status?irmaSessionId=${irmaSessionId}`, {
          withCredentials: true,
        })
        .then(response => response.data);

    case 'SIGN':
      return axios
        .get(`/api/signature-status?irmaSessionId=${irmaSessionId}`, {
          withCredentials: true,
        })
        .then(response => response.data);

    default:
      return Promise.reject('Unkown irmaSessionType');
  }
}

const service = {
  startIrmaSession,
  poll,
};

export default service;
