import axios from 'axios';

function startIrmaSession(irmaUrl, type, content, message, credentials) {
  return axios
    .post(`${irmaUrl}/session`, {
      type,
      content,
      credentials,
      message,
    })
    .then(response => response.data);
}

function poll(server, token) {
  return axios
    .get(`${server}/session/${token}/result`)
    .then(response => response.data);
}

const service = {
  startIrmaSession,
  poll,
};

export default service;
