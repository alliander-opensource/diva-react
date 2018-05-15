import { delay } from 'redux-saga';
import { take, put, call, race, all, takeEvery, fork } from 'redux-saga/effects';

import { types, actions } from '../reducers/diva-reducer';
import service from '../services/diva-service';

function* startIrmaSessionSaga(action) {
  try {
    const response = yield call(service.startIrmaSession, action.irmaSessionType, action.options);
    if (response.irmaSessionId && response.qrContent) {
      yield put(actions.irmaSessionStarted(response.irmaSessionId, response.qrContent));
      yield put(actions.startPolling(action.irmaSessionType, response.irmaSessionId));
    } else {
      yield put(actions.irmaSessionFailedToStart('Server Error', response));
    }
  } catch (error) {
    yield put(actions.irmaSessionFailedToStart('Network Error', error));
  }
}

function* cancelIrmaSessionSaga(action) {
  yield put(actions.stopPolling(action.irmaSessionId));
}

function* processPollSuccess(action) {
  if (['NOT_FOUND', 'DONE', 'CANCELLED'].includes(action.data.serverStatus)) {
    yield put(actions.irmaSessionCompleted(action.data.serverStatus));
    yield put(actions.stopPolling(action.irmaSessionId));
  }
}

function* pollIrmaSessionSaga(irmaSessionType, irmaSessionId) {
  while (true) {
    try {
      const data = yield call(service.poll, irmaSessionType, irmaSessionId);
      yield put(actions.processPollSuccess(irmaSessionId, data));
      yield call(delay, 1000);
    } catch (error) {
      yield put(actions.processPollFailure(irmaSessionId, error));
      yield put(actions.stopPolling(irmaSessionId));
    }
  }
}

export function* watchPollSaga() {
  while (true) {
    const { irmaSessionType, irmaSessionId } = yield take(types.START_POLLING);
    yield race([
      call(pollIrmaSessionSaga, irmaSessionType, irmaSessionId),
      take(action => action.type === types.STOP_POLLING && action.irmaSessionId === irmaSessionId),
    ]);
  }
}

function* divaSagas() {
  yield all([
    takeEvery(types.START_SESSION, startIrmaSessionSaga),
    takeEvery(types.CANCEL_SESSION, cancelIrmaSessionSaga),
    takeEvery(types.PROCESS_POLL_SUCCESS, processPollSuccess),
    fork(watchPollSaga),
  ]);
}

export default divaSagas;
