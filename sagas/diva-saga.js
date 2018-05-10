import { delay } from 'redux-saga';
import { take, put, call, race, all, takeEvery, fork } from 'redux-saga/effects';

import { types, actions } from '../reducers/diva-reducer';
import service from '../services/diva-service';

function* startIrmaSessionSaga(action) {
  try {
    const response = yield call(service.startIrmaSession, action.irmaSessionType, action.options);
    yield put(actions.irmaSessionStarted(response.irmaSessionId, response.qrContent));
    yield put(actions.startPolling(response.irmaSessionId));
  } catch (err) {
    // yield put(actions.processPollFailure(err));
    console.log(err); // TODO failure case
  }
}

/**
 * Polling saga worker.
 */
function* pollSaga(action) {
  console.log(action);
  while (true) {
    try {
      const data = yield call(service.poll, action.irmaSessionId);
      yield put(actions.processPollSuccess(action.irmaSessionId, data));
      yield call(delay, 4000);
    } catch (err) {
      yield put(actions.processPollFailure(action.irmaSessionId, err));
      console.log(err);
    }
  }
}

/**
 * Polling saga watcher.
 */
export function* watchPollSaga() {
  console.log('WATCHING');
  while (true) {
    const action = yield take(types.START_POLLING);
    console.log(action);
    yield race([
      call(pollSaga, action),
      take(types.STOP_POLLING),
    ]);
  }
}

function* divaSagas() {
  yield all([
    takeEvery(types.START_SESSION, startIrmaSessionSaga),
    fork(watchPollSaga),
  ]);
}

export default divaSagas;
