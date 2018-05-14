export const types = {
  START_SESSION: 'DIVA/START_SESSION',
  SESSION_STARTED: 'DIVA/SESSION_STARTED',
  SESSION_FAILED_TO_START: 'DIVA/SESSION_FAILED_TO_START',
  CANCEL_SESSION: 'DIVA/CANCEL_SESSION',
  START_POLLING: 'DIVA/START_POLLING',
  STOP_POLLING: 'DIVA/STOP_POLLING',
  PROCESS_POLL_SUCCESS: 'DIVA/PROCESS_POLL_RESULT',
  PROCESS_POLL_FAILURE: 'DIVA/PROCESS_POLL_FAILURE',
};

export const initialState = {
  irmaSessionType: null,
  isPolling: false,
  irmaSessionId: null,
  sessionStatus: null,
};

export const actions = {
  startIrmaSession: (irmaSessionType, options) =>
    ({ type: types.START_SESSION, irmaSessionType, options }),
  irmaSessionStarted: (irmaSessionId, qrContent) =>
    ({ type: types.SESSION_STARTED, irmaSessionId, qrContent }),
  irmaSessionFailedToStart: (reason, data) =>
    ({ type: types.SESSION_FAILED_TO_START, reason, data }),
  cancelIrmaSession: irmaSessionId =>
    ({ type: types.CANCEL_SESSION, irmaSessionId }),
  startPolling: irmaSessionId =>
    ({ type: types.START_POLLING, irmaSessionId }),
  stopPolling: irmaSessionId =>
    ({ type: types.STOP_POLLING, irmaSessionId }),
  processPollSuccess: (irmaSessionId, data) =>
    ({ type: types.PROCESS_POLL_SUCCESS, irmaSessionId, data }),
  processPollFailure: (irmaSessionId, data) =>
    ({ type: types.PROCESS_POLL_FAILURE, irmaSessionId, data }),
};

export default (state = initialState, action) => {
  switch (action.type) {
    case types.SESSION_STARTED:
      return {
        ...state,
        irmaSessionId: action.irmaSessionId,
        qrContent: action.qrContent,
        sessionCompleted: false,
        sessionStatus: null,
      };
    case types.SESSION_FAILED_TO_START:
      return {
        ...state,
        sessionStatus: 'FAILED_TO_START',
      };
    case types.START_POLLING:
      return {
        ...state,
        isPolling: true,
      };
    case types.PROCESS_POLL_SUCCESS:
      return {
        ...state,
        sessionStatus: action.data.serverStatus,
        sessionCompleted: state.sessionCompleted || (action.data.serverStatus === 'DONE'),
        isPolling: !(state.sessionCompleted || (action.data.serverStatus === 'DONE')),
      };
    case types.PROCESS_POLL_FAILURE:
      return {
        ...state,
        sessionStatus: 'POLLING_FAILED',
      };
    case types.STOP_POLLING:
      return {
        ...state,
        isPolling: false,
      };
    default:
      return state;
  }
};
