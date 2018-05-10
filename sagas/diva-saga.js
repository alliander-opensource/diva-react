import { delay } from 'redux-saga';
import { take, put, call, race, all, takeEvery, fork } from 'redux-saga/effects';

import { types, actions } from '../reducers/diva-reducer';
import service from '../services/diva-service';

function* startIrmaSessionSaga(action) {
  try {
    const response = yield call(service.startIrmaSession, action.irmaSessionType, action.options);
    console.log('RESPONSE', response);
    if (response.irmaSessionId && response.qrContent) {
      yield put(actions.irmaSessionStarted(response.irmaSessionId, response.qrContent));
      yield put(actions.startPolling(response.irmaSessionId));
    } else {
      // Error starting IRMA session: server error
      //yield put(actions.irmaSessionStarted(response.irmaSessionId, response.qrContent));
    }
  } catch (err) {
    // Error starting IRMA session: network error
    // yield put(actions.processPollFailure(err));
    console.log(err); // TODO failure case
  }
}

function* cancelIrmaSessionSaga(action) {
  // TODO: do more cleanup when cancelling, for now we just cancel polling
  yield put(actions.stopPolling(action.irmaSessionId));
}

function* pollIrmaSessionSaga(irmaSessionId) {
  while (true) {
    try {
      // console.log('POLL');
      const data = yield call(service.poll, irmaSessionId);
      console.log(data);
      yield put(actions.processPollSuccess(irmaSessionId, data));
      if (['NOT_FOUND', 'DONE', 'CANCELLED'].includes(data.serverStatus)) {
        yield put(actions.stopPolling(irmaSessionId));
      }
      // }
      yield call(delay, 1000);
    } catch (err) {
      yield put(actions.processPollFailure(irmaSessionId, err));
      yield put(actions.stopPolling(irmaSessionId)); // Stop polling on error
      console.log(err);
    }
  }
}

export function* watchPollSaga() {
  while (true) {
    const { irmaSessionId } = yield take(types.START_POLLING);
    yield race([
      call(pollIrmaSessionSaga, irmaSessionId),
      take(action => action.type === types.STOP_POLLING && action.irmaSessionId === irmaSessionId),
    ]);
  }
}

function* divaSagas() {
  yield all([
    takeEvery(types.START_SESSION, startIrmaSessionSaga),
    takeEvery(types.CANCEL_SESSION, cancelIrmaSessionSaga),
    fork(watchPollSaga),
  ]);
}

export default divaSagas;
