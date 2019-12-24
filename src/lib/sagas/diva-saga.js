import {
  delay, take, put, call, race, all, takeEvery, fork,
} from 'redux-saga/effects';

import { types, actions } from '../reducers/diva-reducer';
import service from '../services/diva-service';

let irmaConfig = {
  irmaUrl: 'https://FILL_IN', // TODO, default IRMA server?
  irmaBackendStartUrl: undefined,
  irmaBackendProofUrl: undefined,
  jwtEnabled: false,
  jwtPublicKey: 'FILL_IN',
};

function* startIrmaSessionSaga(action) {
  try {
    const irmaUrl = irmaConfig.irmaBackendStartUrl
      ? irmaConfig.irmaBackendStartUrl
      : `${irmaConfig.irmaUrl}/session`;
    const response = yield call(
      service.startIrmaSession,
      irmaUrl,
      action.irmaSessionType, action.content, action.message, action.credentials,
    );
    if (response.sessionPtr && response.token) {
      yield put(
        actions.irmaSessionStarted(action.viewId, response.sessionPtr.u, response.sessionPtr),
      );
      const irmaProofUrl = irmaConfig.irmaBackendProofUrl
        ? irmaConfig.irmaBackendProofUrl
        : `${irmaConfig.irmaUrl}/${response.token}/result`;
      yield put(
        actions.startPolling(
          action.viewId, action.irmaSessionType, response.sessionPtr.u, irmaProofUrl,
        ),
      );
    } else {
      yield put(actions.irmaSessionFailedToStart(action.viewId, 'Server Error', response));
    }
  } catch (error) {
    yield put(actions.irmaSessionFailedToStart(action.viewId, 'Network Error', error));
  }
}

function* abandonIrmaSessionSaga(action) {
  yield put(actions.stopPolling(action.viewId, action.irmaSessionId));
}

function* processPollSuccess(action) {
  if (action.data && action.data.status === 'DONE') {
    const proof = yield call(
      service.getProof, action.irmaProofUrl, irmaConfig.jwtEnabled, irmaConfig.jwtPublicKey,
    );

    if (action.irmaSessionType === 'signature') {
      yield put(
        actions.signatureSessionCompleted(
          action.viewId,
          proof.status,
          proof.proofStatus,
          proof.disclosed,
          proof.signature,
          proof.jwt,
        ),
      );
    } else {
      yield put(
        actions.discloseSessionCompleted(
          action.viewId,
          proof.status,
          proof.proofStatus,
          proof.disclosed,
          proof.jwt,
        ),
      );
    }
  }

  if (['TIMEOUT', 'DONE', 'CANCELLED'].includes(action.data.status)) {
    yield put(actions.stopPolling(action.viewId, action.irmaSessionId));
  }
}

function* pollIrmaSessionSaga(viewId, irmaSessionType, irmaSessionId, irmaProofUrl) {
  while (true) {
    try {
      const data = yield call(service.poll, irmaSessionId);
      yield put(
        actions.processPollSuccess(viewId, irmaSessionType, irmaSessionId, data, irmaProofUrl),
      );
      yield delay(1000);
    } catch (error) {
      yield put(actions.processPollFailure(viewId, irmaSessionId, error));
      yield put(actions.stopPolling(viewId, irmaSessionId));
    }
  }
}

export function* watchPollSaga() {
  while (true) {
    const {
      viewId, irmaSessionType, irmaSessionId, irmaProofUrl,
    } = yield take(types.START_POLLING);
    yield race([
      call(pollIrmaSessionSaga, viewId, irmaSessionType, irmaSessionId, irmaProofUrl),
      take(action => action.type === types.STOP_POLLING && action.irmaSessionId === irmaSessionId),
    ]);
  }
}

function* divaSagas(passedIrmaConfig) {
  if (passedIrmaConfig !== undefined) {
    // TODO: config validation?
    irmaConfig = passedIrmaConfig;
  }

  yield all([
    takeEvery(types.START_SESSION, startIrmaSessionSaga),
    takeEvery(types.ABANDON_SESSION, abandonIrmaSessionSaga),
    takeEvery(types.PROCESS_POLL_SUCCESS, processPollSuccess),
    fork(watchPollSaga),
  ]);
}

export default divaSagas;
