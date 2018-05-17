import { delay } from 'redux-saga';
import { take, put, call, race, all, takeEvery, fork } from 'redux-saga/effects';

import { types, actions } from '../reducers/diva-reducer';
import service from '../services/diva-service';

function* startIrmaSessionSaga(action) {
  try {
    const response = yield call(
      service.startIrmaSession, action.irmaSessionType, action.options,
    );
    if (response.irmaSessionId && response.qrContent) {
      yield put(
        actions.irmaSessionStarted(action.viewId, response.irmaSessionId, response.qrContent),
      );
      yield put(
        actions.startPolling(action.viewId, action.irmaSessionType, response.irmaSessionId));
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
  if (['NOT_FOUND', 'DONE', 'CANCELLED'].includes(action.data.serverStatus)) {
    yield put(
      actions.irmaSessionCompleted(
        action.viewId, action.data.serverStatus, action.data.proofStatus,
      ),
    );
    yield put(actions.stopPolling(action.viewId, action.irmaSessionId));
  }
}

function* pollIrmaSessionSaga(viewId, irmaSessionType, irmaSessionId) {
  while (true) {
    try {
      const data = yield call(service.poll, irmaSessionType, irmaSessionId);
      yield put(actions.processPollSuccess(viewId, irmaSessionId, data));
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

function* divaSagas() {
  yield all([
    takeEvery(types.START_SESSION, startIrmaSessionSaga),
    takeEvery(types.ABANDON_SESSION, abandonIrmaSessionSaga),
    takeEvery(types.PROCESS_POLL_SUCCESS, processPollSuccess),
    fork(watchPollSaga),
  ]);
}

export default divaSagas;
