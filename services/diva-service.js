import axios from 'axios';

function startIrmaSession(irmaSessionType, options) {
  console.log(irmaSessionType, options);
  return axios
    .post('/api/start-irma-session', {
      type: irmaSessionType,
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

const service = {
  startIrmaSession,
  poll: () => axios({ url: '' }),
};

export default service;
