import axios from 'axios';
import jwt from 'jsonwebtoken';

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

function pollJwt(token, irmaUrl, jwtPublicKey) {
  return axios
    .get(`${irmaUrl}/session/${token}/result-jwt`)
    .then(response => response.data)
    .then((jwtToken) => {
      const jwtBody = jwt.verify(jwtToken, jwtPublicKey); // TODO: check audience!

      return {
        ...jwtBody,
        jwt: jwtToken,
      };
    });
}

function pollPlain(token, irmaUrl) {
  return axios
    .get(`${irmaUrl}/session/${token}/result`)
    .then(response => response.data);
}

function poll(token, irmaUrl, jwtEnabled, jwtPublicKey) {
  if (jwtEnabled) {
    return pollJwt(token, irmaUrl, jwtPublicKey);
  }

  return pollPlain(token, irmaUrl);
}

const service = {
  startIrmaSession,
  poll,
};

export default service;
