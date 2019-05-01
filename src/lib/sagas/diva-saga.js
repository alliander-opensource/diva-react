import { delay } from 'redux-saga';
import { take, put, call, race, all, takeEvery, fork } from 'redux-saga/effects';

import { types, actions } from '../reducers/diva-reducer';
import service from '../services/diva-service';

let irmaConfig = {
  irmaUrl: 'https://FILL_IN', // TODO, default IRMA server?
  jwtEnabled: false,
  jwtPublicKey: 'FILL_IN',
};

function* startIrmaSessionSaga(action) {
  try {
    const response = yield call(
      service.startIrmaSession,
      irmaConfig.irmaUrl,
      action.irmaSessionType, action.content, action.message, action.credentials,
    );
    if (response.sessionPtr && response.token) {
      yield put(
        actions.irmaSessionStarted(action.viewId, response.token, response.sessionPtr),
      );
      yield put(
        actions.startPolling(
          action.viewId, action.irmaSessionType, response.token, response.sessionPtr));
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
  if (['TIMEOUT', 'DONE', 'CANCELLED'].includes(action.data.status)) {
    if (action.irmaSessionType === 'signing') {
      yield put(
        actions.signatureSessionCompleted(
          action.viewId,
          action.data.status,
          action.data.proofStatus,
          action.data.disclosed,
          action.data.signature,
          action.data.jwt,
        ),
      );
    } else {
      yield put(
        actions.discloseSessionCompleted(
          action.viewId,
          action.data.status,
          action.data.proofStatus,
          action.data.disclosed,
          action.data.jwt,
        ),
      );
    }
    yield put(actions.stopPolling(action.viewId, action.irmaSessionId));
  }
}

function* pollIrmaSessionSaga(viewId, irmaSessionType, irmaSessionId) {
  while (true) {
    try {
      const { irmaUrl, jwtEnabled, jwtPublicKey } = irmaConfig;
      const data = yield call(service.poll, irmaSessionId, irmaUrl, jwtEnabled, jwtPublicKey);
      yield put(actions.processPollSuccess(viewId, irmaSessionType, irmaSessionId, data));
      yield call(delay, 1000);
    } catch (error) {
      yield put(actions.processPollFailure(viewId, irmaSessionId, error));
      yield put(actions.stopPolling(viewId, irmaSessionId));
    }
  }
}

export function* watchPollSaga() {
  while (true) {
    const { viewId, irmaSessionType, irmaSessionId } = yield take(types.START_POLLING);
    yield race([
      call(pollIrmaSessionSaga, viewId, irmaSessionType, irmaSessionId),
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
