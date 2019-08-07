export const types = {
  CLEAR_SESSION: 'DIVA/CLEAR_SESSION',
  START_SESSION: 'DIVA/START_SESSION',
  SESSION_STARTED: 'DIVA/SESSION_STARTED',
  SESSION_FAILED_TO_START: 'DIVA/SESSION_FAILED_TO_START',
  ABANDON_SESSION: 'DIVA/ABANDON_SESSION',
  START_POLLING: 'DIVA/START_POLLING',
  STOP_POLLING: 'DIVA/STOP_POLLING',
  PROCESS_POLL_SUCCESS: 'DIVA/PROCESS_POLL_RESULT',
  PROCESS_POLL_FAILURE: 'DIVA/PROCESS_POLL_FAILURE',
  DISCLOSE_SESSION_COMPLETED: 'DIVA/DISCLOSE_SESSION_COMPLETED',
  SIGNATURE_SESSION_COMPLETED: 'DIVA/SIGNATURE_SESSION_COMPLETED',
};

export const initialState = {
  attributes: [],
  sessions: {},
};

export const actions = {
  clearSession: () =>
    ({ type: types.CLEAR_SESSION }),
  startIrmaSession: (viewId, irmaSessionType, content, message, credentials) =>
    ({ type: types.START_SESSION, viewId, irmaSessionType, content, message, credentials }),
  irmaSessionStarted: (viewId, irmaSessionId, qrContent) =>
    ({ type: types.SESSION_STARTED, viewId, irmaSessionId, qrContent }),
  irmaSessionFailedToStart: (viewId, reason, data) =>
    ({ type: types.SESSION_FAILED_TO_START, viewId, reason, data }),
  abandonIrmaSession: (viewId, irmaSessionId) =>
    ({ type: types.ABANDON_SESSION, viewId, irmaSessionId }),
  startPolling: (viewId, irmaSessionType, irmaSessionId, qrContent) =>
    ({ type: types.START_POLLING, viewId, irmaSessionType, irmaSessionId, qrContent }),
  stopPolling: (viewId, irmaSessionId) =>
    ({ type: types.STOP_POLLING, viewId, irmaSessionId }),
  processPollSuccess: (viewId, irmaSessionType, irmaSessionId, data) =>
    ({ type: types.PROCESS_POLL_SUCCESS, viewId, irmaSessionType, irmaSessionId, data }),
  processPollFailure: (viewId, irmaSessionId, data) =>
    ({ type: types.PROCESS_POLL_FAILURE, viewId, irmaSessionId, data }),
  discloseSessionCompleted: (viewId, status, proofStatus, disclosedAttributes, jwt) =>
    ({
      type: types.DISCLOSE_SESSION_COMPLETED, viewId, status, proofStatus, disclosedAttributes, jwt,
    }),
  signatureSessionCompleted: (viewId, status, proofStatus, disclosedAttributes, signature, jwt) =>
    ({
      type: types.SIGNATURE_SESSION_COMPLETED,
      viewId,
      status,
      proofStatus,
      disclosedAttributes,
      signature,
      jwt,
    }),
};

function containsAttribute(attributeStore, newAttribute) {
  // TMP hack: we filter 'extra' attributes due to a bug in the irma server
  // which returns them even if isn't requested
  if (newAttribute.status === 'EXTRA') {
    return true;
  }

  return attributeStore.some(
    ({ rawvalue, id }) =>
      (newAttribute.rawvalue === rawvalue && newAttribute.id === id),
  );
}

function flatten(arrays) {
  return [].concat.apply([], arrays); // eslint-disable-line prefer-spread
}

function filterDuplicateAttributes(attributeStore, newAttributes) {
  return newAttributes.filter(el => !containsAttribute(attributeStore, el));
}

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
    case types.CLEAR_SESSION:
      return initialState;
    case types.START_SESSION:
      return {
        ...state,
        sessions: {
          ...state.sessions,
          [action.viewId]: {
            irmaSessionType: action.irmaSessionType,
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
    case types.PROCESS_POLL_SUCCESS:
      return updateStateForViewIdWith(state, action.viewId, {
        sessionStatus: action.data.status,
      });
    case types.PROCESS_POLL_FAILURE:
      return updateStateForViewIdWith(state, action.viewId, {
        sessionStatus: 'POLLING_FAILED',
      });
    case types.STOP_POLLING:
      return state;
    case types.DISCLOSE_SESSION_COMPLETED: {
      const newState = updateStateForViewIdWith(state, action.viewId, {
        proofStatus: action.proofStatus,
        jwt: action.jwt,
      });
      // TODO: don't convert to a flat array and keep condiscon structure?
      const disclosedAttributes = (action.disclosedAttributes !== undefined)
        ? flatten(action.disclosedAttributes) : [];
      return {
        ...newState,
        attributes:
          state.attributes.concat(filterDuplicateAttributes(state.attributes, disclosedAttributes)),
      };
    }
    case types.SIGNATURE_SESSION_COMPLETED:
      return updateStateForViewIdWith(state, action.viewId, {
        proofStatus: action.proofStatus,
        jwt: action.jwt,
        disclosedAttributes: flatten(action.disclosedAttributes)
          .filter(el => el.status !== 'EXTRA'), // TMP hack, see comment above in containsAttribute()
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
