export const types = {
  START_SESSION: 'DIVA/START_SESSION',
  SESSION_STARTED: 'DIVA/SESSION_STARTED',
  SESSION_FAILED_TO_START: 'DIVA/SESSION_FAILED_TO_START',
  ABANDON_SESSION: 'DIVA/ABANDON_SESSION',
  START_POLLING: 'DIVA/START_POLLING',
  STOP_POLLING: 'DIVA/STOP_POLLING',
  PROCESS_POLL_SUCCESS: 'DIVA/PROCESS_POLL_RESULT',
  PROCESS_POLL_FAILURE: 'DIVA/PROCESS_POLL_FAILURE',
  SESSION_COMPLETED: 'DIVA/SESSION_COMPLETED',
};

export const initialState = {
  sessions: {},
};

export const actions = {
  startIrmaSession: (viewId, irmaSessionType, options) =>
    ({ type: types.START_SESSION, viewId, irmaSessionType, options }),
  irmaSessionStarted: (viewId, irmaSessionId, qrContent) =>
    ({ type: types.SESSION_STARTED, viewId, irmaSessionId, qrContent }),
  irmaSessionFailedToStart: (viewId, reason, data) =>
    ({ type: types.SESSION_FAILED_TO_START, viewId, reason, data }),
  abandonIrmaSession: (viewId, irmaSessionId) =>
    ({ type: types.ABANDON_SESSION, viewId, irmaSessionId }),
  startPolling: (viewId, irmaSessionType, irmaSessionId) =>
    ({ type: types.START_POLLING, viewId, irmaSessionType, irmaSessionId }),
  stopPolling: (viewId, irmaSessionId) =>
    ({ type: types.STOP_POLLING, viewId, irmaSessionId }),
  processPollSuccess: (viewId, irmaSessionId, data) =>
    ({ type: types.PROCESS_POLL_SUCCESS, viewId, irmaSessionId, data }),
  processPollFailure: (viewId, irmaSessionId, data) =>
    ({ type: types.PROCESS_POLL_FAILURE, viewId, irmaSessionId, data }),
  irmaSessionCompleted: (viewId, serverStatus, proofStatus, signature) =>
    ({ type: types.SESSION_COMPLETED, viewId, serverStatus, proofStatus, signature }),
};

function updateStateForViewIdWith(state, viewId, update) {
  return {
    ...state,
    sessions: {
      ...state.sessions,
      [viewId]: {
        ...state.sessions[viewId],
        ...update,
      },
    },
  };
}

export default (state = initialState, action) => {
  switch (action.type) {
    case types.START_SESSION:
      return {
        ...state,
        sessions: {
          ...state.sessions,
          [action.viewId]: {
            irmaSessionType: action.irmaSessionType,
            isPolling: false,
            sessionStatus: 'REQUESTED',
            started: true,
          },
        },
      };
    case types.SESSION_STARTED:
      return updateStateForViewIdWith(state, action.viewId, {
        irmaSessionId: action.irmaSessionId,
        qrContent: action.qrContent,
        sessionStatus: 'STARTED',
      });
    case types.SESSION_FAILED_TO_START:
      return updateStateForViewIdWith(state, action.viewId, {
        sessionStatus: 'FAILED_TO_START',
      });
    case types.START_POLLING:
      return updateStateForViewIdWith(state, action.viewId, {
        isPolling: true,
      });
    case types.PROCESS_POLL_SUCCESS:
      return updateStateForViewIdWith(state, action.viewId, {
        sessionStatus: action.data.serverStatus,
      });
    case types.PROCESS_POLL_FAILURE:
      return updateStateForViewIdWith(state, action.viewId, {
        sessionStatus: 'POLLING_FAILED',
      });
    case types.STOP_POLLING:
      return updateStateForViewIdWith(state, action.viewId, {
        isPolling: false,
      });
    case types.SESSION_COMPLETED:
      return updateStateForViewIdWith(state, action.viewId, {
        proofStatus: action.proofStatus,
        signature: action.signature,
      });
    case types.ABANDON_SESSION:
      if (state.sessions[action.viewId].sessionStatus !== 'DONE') {
        return updateStateForViewIdWith(state, action.viewId, {
          sessionStatus: 'ABANDONED',
        });
      }
      return state;

    default:
      return state;
  }
};
