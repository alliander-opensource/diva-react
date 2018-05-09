export const types = {
  START_SESSION: 'IRMA/START_SESSION',
  SESSION_STARTED: 'IRMA/SESSION_STARTED',
  START_POLLING: 'IRMA/START_POLLING',
  STOP_POLLING: 'IRMA/STOP_POLLING',
  PROCESS_POLL_SUCCESS: 'IRMA/PROCESS_POLL_RESULT',
  PROCESS_POLL_FAILURE: 'IRMA/PROCESS_POLL_FAILURE',
};

export const initialState = {
  irmaSessionType: null,
  isPolling: false,
  irmaSessionId: null,
  sessionStatus: null,
  // isLoading: false,
  // error: null
};

export default (state = initialState, action) => {
  switch (action.type) {
    case types.SESSION_STARTED:
      return {
        ...state,
        irmaSessionId: action.irmaSessionId,
        qrContent: action.qrContent,
      }
    case types.START_POLLING:
      return {
        ...state,
        isPolling: true,
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

export const actions = {
  startIrmaSession: (irmaSessionType, options) =>
    ({ type: types.START_SESSION, irmaSessionType, options }),
  irmaSessionStarted: (irmaSessionId, qrContent) =>
    ({ type: types.SESSION_STARTED, irmaSessionId, qrContent }),
  startPolling: () => ({ type: types.START_POLLING }),
  stopPolling: () => ({ type: types.STOP_POLLING }),
  processPollSuccess: data => ({ type: types.PROCESS_POLL_SUCCESS, data }),
  processPollFailure: data => ({ type: types.PROCESS_POLL_FAILURE, data }),
  // login: (email, password) => ({ type: actionTypes.LOGIN_REQUEST, email, password }),
  // logout: () => ({ type: actionTypes.LOGOUT })
};
