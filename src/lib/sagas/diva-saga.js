import { delay } from 'redux-saga';
import { take, put, call, race, all, takeEvery, fork } from 'redux-saga/effects';

import { types, actions } from '../reducers/diva-reducer';
import service from '../services/diva-service';

function* startIrmaSessionSaga(irmaUrl, action) {
  try {
    const response = yield call(
      service.startIrmaSession,
      irmaUrl,
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
        ),
      );
    } else {
      yield put(
        actions.discloseSessionCompleted(
          action.viewId,
          action.data.status,
          action.data.proofStatus,
          action.data.disclosed,
        ),
      );
    }
    yield put(actions.stopPolling(action.viewId, action.irmaSessionId));
  }
}

function* pollIrmaSessionSaga(viewId, irmaSessionType, irmaSessionId, qrContent, baseUrl) {
  while (true) {
    try {
      const data = yield call(service.poll, baseUrl, irmaSessionId);
      yield put(actions.processPollSuccess(viewId, irmaSessionType, irmaSessionId, data));
      yield call(delay, 1000);
    } catch (error) {
      yield put(actions.processPollFailure(viewId, irmaSessionId, error));
      yield put(actions.stopPolling(viewId, irmaSessionId));
    }
  }
}

export function* watchPollSaga(baseUrl) {
  while (true) {
    const { viewId, irmaSessionType, irmaSessionId, qrContent } = yield take(types.START_POLLING);
    yield race([
      call(pollIrmaSessionSaga, viewId, irmaSessionType, irmaSessionId, qrContent, baseUrl),
      take(action => action.type === types.STOP_POLLING && action.irmaSessionId === irmaSessionId),
    ]);
  }
}

function* divaSagas(baseUrl = '/api') {
  yield all([
    takeEvery(types.START_SESSION, startIrmaSessionSaga, baseUrl),
    takeEvery(types.ABANDON_SESSION, abandonIrmaSessionSaga),
    takeEvery(types.PROCESS_POLL_SUCCESS, processPollSuccess),
    fork(watchPollSaga, baseUrl),
  ]);
}

export default divaSagas;
