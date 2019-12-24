import axios from 'axios';
import jwt from 'jsonwebtoken';

function startIrmaSession(irmaUrl, type, disclose, message, credentials) {
  return axios
    .post(`${irmaUrl}`, {
      '@context': `https://irma.app/ld/request/${type}/v2`,
      disclose,
      credentials,
      message,
    })
    .then(response => response.data);
}

function getProofJwt(irmaProofUrl, jwtPublicKey) {
  return axios
    .get(`${irmaProofUrl}`, {
      withCredentials: true,
    })
    .then(response => response.data)
    .then((jwtToken) => {
      // TODO: IRMA server doesn't send audience?
      const jwtBody = jwt.verify(jwtToken, jwtPublicKey);

      return {
        ...jwtBody,
        jwt: jwtToken,
      };
    });
}

function getProof(irmaProofUrl, jwtEnabled, jwtPublicKey) {
  if (jwtEnabled) {
    return getProofJwt(irmaProofUrl, jwtEnabled, jwtPublicKey);
  }

  return axios
    .get(`${irmaProofUrl}`)
    .then(response => response.data);
}

function poll(irmaSessionUrl) {
  return axios
    .get(`${irmaSessionUrl}/status`)
    .then(response => ({ status: response.data }));
}

const service = {
  startIrmaSession,
  getProof,
  poll,
};

export default service;
