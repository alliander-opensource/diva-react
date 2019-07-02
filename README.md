# diva-react

This repository contains a library to easily integrate [IRMA attributes](https://privacybydesign.foundation/irma-verifier/) into React based applications.

See [diva-js-reference-3p-frontend](https://github.com/Alliander/diva-js-reference-3p-frontend) for an example implementation of this library.

IRMA is a decentralized, attribute based Identity Management protocol that allows easy and fine-grained authentication (and based on specific attributes) authorization. Attributes are issued by trusted issuers and therefore provide easy validation of users.

## Features

This library can be used in a React frontend to create and visualise IRMA disclosure, issuing and signing sessions.

This library allows you to:
- Only show pages if certain attributes are disclosed using [React higher order components](https://reactjs.org/docs/higher-order-components.html)
- Visualise signing and issuing sessions with React Components
  - This is done with `<Sign /> and <IssueCredentials />`), which handle IRMA sessions by showing a QR code and adapting to user interaction
- Store IRMA-session related information in a [Redux](https://github.com/reduxjs/react-redux) reducer
- Makes sure IRMA sessions are correctly handled with a [Background saga](https://redux-saga.js.org/)

## Note for diva-react 1.x users

Diva-react version 2.0.0 has been refactored to support the new IRMA protocol with the new [IRMA server](https://irma.app/docs/next/api-irma-server/). With this change, Diva doesn't require a backend anymore. Specify the URL to your IRMA server in `src/sagas/index.js` and run it with the version 2.0.0 of [diva-js-reference-3p-frontend](https://github.com/Alliander/diva-js-reference-3p-frontend).

With this refactor, we also upgraded to Material UI 4.x and React 16.8.

Notable absent features:
- No session support (still uncertain whether we will add that again)
- No Authenticated IRMA JWT issue/disclose support (however JWT token coming from the IRMA server can be verified)

# Installation

Diva-react requires React, Redux and Redux-saga.

Installation into your project can be done with:

```
    npm install && npm run build && npm link
```

TODO: add version 2.0.0 to NPM for easier installation.

## Initial setup

Diva-react needs to be added to your existing reducers and sagas. See [diva-js-reference-3p-frontend](https://github.com/Alliander/diva-js-reference-3p-frontend) for an example setup.

### Reducer configuration

To add it to your reducers, do something like this in your `src/reducers/index.js`:

```
import { combineReducers } from 'redux';

import yourOwnReducer from './your-own-reducer';
import { divaReducer } from 'diva-react';

const rootReducer = combineReducers({
  yourOwnReducer,
  divaReducer,
});

export default rootReducer;
```

You now have access to a divaReducer object in your Redux state, which contains information about running IRMA sessions. Generally it isn't needed to do anything with it, since it's mainly used within Diva-react's components.

### Saga configuration

With the Saga configuration, the URL and keys to the IRMA server must also be configured.

To add diva-react to your sagas, do something like this in your `src/sagas/index.js`:

```
import { all } from 'redux-saga/effects';

import yourOwnSaga from './yourOwnSaga';
import { divaSaga } from 'diva-react';

const irmaConfig = {
  irmaUrl: 'https://url-to-your-irma-server',   // See https://irma.app/docs/next/api-irma-server/
  jwtEnabled: false,                            // Request and verify responses from IRMA server in JWT format
  jwtPublicKey:                                 // Insert PEM-enocded public key of IRMA server. Only needed if jwtEnabled = true
};

export default function* rootSaga() {
  yield all([
    yourOwnSaga(),
    divaSaga(irmaConfig),
  ]);
}
```

You can now fire `START_SESSION` and `ABANDON_SESSION` redux actions, which will use this saga to start IRMA sessions in the background. Generally it's recommended to use Diva-react's exposed components to start IRMA sessions (instead of firing these actions directly).

# Starting IRMA sessions

Once you setup the reducers and sagas correctly, you can import Diva-react components in your views to start IRMA sessions.

## Disclosure

To require attribute disclosure before another page can be seen, use Diva-react's higher order components `WithSimpleDivaAuthorization` or `WithDivaAuthorization` in your route to the original React component.

For instance, if you have a route to a `<MyAccount />` component, the original route:

```
<Route path="/my-account”
	component={ MyAccount }/>
```

becomes

```
import {WithSimpleDivaAuthorization } from 'diva-react';

<Route
  path="/my-account”
  component={ WithSimpleDivaAuthorization(attributes, 'pbdf.pbdf.email.email', 'Email')(MyAccount) }
/>
```

Now, the `MyAccount` component will only be shown *after* the user has disclosed his/her email address attribute. Any container component can be wrapped with the `WithSimpleDivaAuthorization` component to control identity requirements. See the App container of [diva-js-reference-3p-frontend](https://github.com/Alliander/diva-js-reference-3p-frontend) for an example.

The attributes variable can be obtained from the redux store, you can map it to a React prop with something like this:

```
const mapStateToProps = state => ({
  attributes: state.divaReducer.attributes,
});
export default connect(mapStateToProps)(YourComponent);
```

Note: for more complex scenarios, use the `WithDivaAuthorization` higher order component, see the API reference below.

Note 2: To only show a QR code instead of a whole styled page, pass 'true' as last argument to `WithDivaAuthorization` or `WithSimpleDivaAuthorization`.

## Signing

To show a QR code to start an IRMA signing session, use the following component:

```
import {Sign } from 'diva-react';
<Sign
  requiredAttributes={required_attributes}
  message={message_to_be_signed}
  viewId="unique_id_for_this_view"
  qrOnly={false}
/>
```

The Sign component required three properties:
- `requiredAttributes` contains the list of required attributes in the signature, which is defined as 'a set of conjunctions containing disjunctions', a concept that is explained [at the IRMA webpage](http://credentials.github.io/protocols/irma-protocol/#verification)
- `message` contains the message that will be signed by the user
- `viewId` needs to be a unique id to separate this IRMA session from other running IRMA sessions in the same application
- `qrOnly` (optional): set to true to only show QR code instead of page with styling.


After the IRMA session is completed, an `DIVA/SIGNATURE_SESSION_COMPLETED` action will be fired, which results in an IRMA signature and corresponding attributes object in `divaReducer.sessions['viewId']` (where `viewId` was passed as property to the Sign component). In this way, you can use this result in your React component as properties mapped from the Redux state.

Additionally, you can watch in your sagas for an `DIVA/SIGNATURE_SESSION_COMPLETED` event and start another saga. For example:

```
    import { types as divaTypes } from 'diva-react';
    takeEvery(action => action.type === divaTypes.SESSION_COMPLETED && action.viewId === 'your_unique_view_id', yourSaga),
```

## Issuing


** Note: diva-react is a frontend-only app, and thus cannot be trusted with issuing requests to the IRMA server. Always use a backend to initiate issuing requests after the user has been authenticated! **

The `<IssueCredentials>` React component works in the same way as the `<Sign>` component. To show a QR code to initiate an issue session caal it with a `viewId` and a `credentials` list:

```
import { IssueCredentials } from 'diva-react';

const IssueCredentialsPage = () => (
  <IssueCredentials
    viewId="unique_id_for_this_view"
    credentials="irma_credential_request"
    qrOnly={false}
  />
);
```

See [the irma documentation](https://irma.app/docs/next/session-requests/#issuance-requests) for the syntax of the IRMA credential request (you only need to send the array passed in the `credentials` field of the session request). See [diva-js-reference-3p-frontend](https://github.com/Alliander/diva-js-reference-3p-frontend) for an example.

Like with signing, an `DIVA/SESSION_COMPLETED` action will be fired.

# API reference

## Saga and reducer
Diva-react exposes a `divaSaga` object that needs to be added to your own sagas (see instructions above). This saga is responsible for starting and handling IRMA sessions. Direct interaction isn't usually needed. However, the following actions can be fired to handle IRMA sessions:

- `START_SESSION`
- `ABANDON_SESSION`

We will explain these actions in detail below.

Diva-react also exposes a `divaReducer` object that needs to be added to your own reducers (see instructions above).

### Redux Reducer types overview

See the actions section for corresponding parameters / input to these types.

*Externally usable*:
- `START_SESSION`
   - Used to start a new IRMA session.
- `SESSION_STARTED`
   - Used to denote that an IRMA session has been successfully started.
   - Contains information that needs to be put into a QR code.
- `SESSION_FAILED_TO_START`
   - Failure case: used when an IRMA cannot be started.
- `ABANDON_SESSION`
   - Used to stop/cancel a running IRMA session. This can for instance be used to stop a running IRMA session if the user leave the page/clicks on something.
- `SESSION_COMPLETED`
   - Used when an IRMA session has been successfully finished (there is data disclosed, signed or issued). This can be used to interact in your application on a successful IRMA session.

*Internal actions*:
- `START_POLLING`
   - Internally used to start polling the backend for an IRMA proof/result.
- `STOP_POLLING`
   - Internally used to stop polling the backend for an IRMA proof/result.
- `PROCESS_POLL_SUCCESS`
   - Internally used to process the result of a poll call.
- `PROCESS_POLL_FAILURE`
   - Internally used when polling failed.

### Redux actions

*Externally usable*:
- `startIrmaSession`
    - Used to start a new IRMA session, will produce a `START_SESSION` action.
    - It takes the following parameters:
        - `viewId:` Id of the view component (used so that the right view will be updated if we have multiple sessions at the same time). Should be unique per application.
        - `irmaSessionType:` The type of session that will be started, can be: ISSUE, DISCLOSE or SIGN.
            - These types will we matched at the backend.
        - `options:` Dictionary with IRMA session specific options, the following options are available:
            - `attributesRequired:` List of attributes that need to be disclosed, this is an IRMA Api Server content object, see the (IRMA documentation)[http://credentials.github.io/protocols/irma-protocol/#verification] for details.
            - `message:` The message that needs to be signed in case of IRMA signing session. This option is only relevant for IRMA signing sessions.
            - `credentials:` The list of credentials in een Issuing request, see [the irma documentation](https://irma.app/docs/next/session-requests/#issuance-requests).
- `irmaSessionStarted`
    - Used to denote that an IRMA session has been successfully started.
    - This action will normally only be fired as a result of a `startIrmaSession` action.
    - It takes the following parameters:
        - `viewId:` Id of the view component (used so that the right view will be updated if we have multiple sessions at the same time). Should be unique per application.
        - `irmaSessionId:` The id of the IRMA session at the IRMA Api Server.
        - `qrContent:` The content of the QR code that needs to be served at the client.
- `irmaSessionFailedToStart`
    - Failure case: used when an IRMA session cannot be started.
    - This action will normally only be fired as a result of a `startIrmaSession` action.
    - It takes the following parameters:
        - `viewId:` Id of the view component (used so that the right view will be updated if we have multiple sessions at the same time). Should be unique per application.
        - `reason:` Reason of failure
        - `data:` Raw http response data of failed call
- `abandonIrmaSession`
    - Used to stop/cancel a running IRMA session. This can for instance be used to stop a running IRMA session if the user leave the page/clicks on something.
    - This action will normally only be fired if an IRMA session is currently running.
    - It takes the following parameters:
        - `viewId:` Id of the view component (used so that the right view will be updated if we have multiple sessions at the same time). Should be unique per application.
        - `irmaSessionId:` The id of the IRMA session at the IRMA Api Server.
- `irmaSessionCompleted`
    - Used when an IRMA session has been successfully finished (there is data disclosed, signed or issued). This can be used to interact in your application on a successful IRMA session.
    - It takes the following parameters:
        - `viewId:` Id of the view component (used so that the right view will be updated if we have multiple sessions at the same time). Should be unique per application.
        - `serverStatus:` Status returned bij the IRMA api server, mainly used internally to stop polling in case of:
            - `CANCELLED`: User cancelled on the phone (or doesn't possess the required attributes/forgot his pin/etc.).
            - `DONE`: The IRMA session has been done, a disclosure proof or signature can be retrieved.
            - `NOT_FOUND`: The IRMA session cannot be foun.
            - See for other possible statuses [diva-irma-js](https://github.com/Alliander/diva-irma-js#exposed-functions-1)
        - `proofStatus:` The status of the IRMA proof or signature, which can be:
            - `VALID`: The proof is valid
            - `INVALID`: The proof is invalid
            - `EXPIRED`: The proof is valid but the attributes are expired
        - `signature:` The IRMA signature. This option is only relevant for IRMA signing sessions.

*Internal actions*:
- `startPolling`
    - Internally used to start polling the backend for an IRMA proof/result.
    - This action will normally only be fired as a result of a `startIrmaSession` action.
    - It takes the following parameters:
        - `viewId:` Id of the view component (used so that the right view will be updated if we have multiple sessions at the same time). Should be unique per application.
        - `irmaSessionType:` The type of session that will be polled, can be: ISSUE, DISCLOSE or SIGN.
        - `irmaSessionId:` The id of the IRMA session at the IRMA Api Server.
- `stopPolling`
    - Internally used to start polling the backend for an IRMA proof/result.
    - This action will normally only be fired as a result of a `abandonIrmaSession`, `irmaSessionCompleted` or `processPollFailure` action.
    - It takes the following parameters:
        - `viewId:` Id of the view component (used so that the right view will be updated if we have multiple sessions at the same time). Should be unique per application.
        - `irmaSessionId:` The id of the IRMA session at the IRMA Api Server.
- `processPollSuccess` and `processPollFailure`
   - Internally used to process the result of a poll call, either failed or success
    - It takes the following parameters:
        - `viewId:` Id of the view component (used so that the right view will be updated if we have multiple sessions at the same time). Should be unique per application.
        - `irmaSessionId:` The id of the IRMA session at the IRMA Api Server.
        - `data:` The raw HTTP response data

## React Components

All components need to be bound to a Redux store that contains the reducer/saga that are described here. In addition, some additional properties can be passed to them, as described here:

- `IssueCredentials` - Used for issuing credentials.
    - `viewId:` Id of the view component (used so that the right view will be updated if we have multiple sessions at the same time). Should be unique per application.
    - `credentialType:` Type of credential that will be issued, see issuing section for example.
- `Sign` - Used for signing messages.
    - `viewId:` Id of the view component (used so that the right view will be updated if we have multiple sessions at the same time). Should be unique per application.
    - `message:` The message that will be signed by the user
    - `requiredAttributes:` contains the list of required attributes in the signature, which is defined as 'a set of conjunctions containing disjunctions', a concept that is explained [at the IRMA webpage](http://credentials.github.io/protocols/irma-protocol/#verification)

For disclosure, two high-order components are available, which will show a QR code if attributes aren't disclosed yet, or show the underlying component if attributes are already disclosed:
- `WithDivaAuthorization` - Default version
    - `viewId:` Id of the view component (used so that the right view will be updated if we have multiple sessions at the same time). Should be unique per application.
    - `attributes:` A dictionary with attributes that are already disclosed. The key is the attribute identifier (for instance `pbdf.pbdf.email.email` for an e-mail attribute issued by the Privacy By Design foundation). The value is the value of the attribute of the user. One can obtain this value from Redux in `divaReducer.attributes`.
    - `requiredAttributes:` A list of attributes that need to be disclosed. This list is an IRMA API Server content object, see the (IRMA documentation)[http://credentials.github.io/protocols/irma-protocol/#verification] for details.
- `WithSimpleDivaAuthorization` - Simplified version that can only request disclosure of one attribute
    - `viewId:` Id of the view component (used so that the right view will be updated if we have multiple sessions at the same time). Should be unique per application.
    - `attributes:` A dictionary with attributes that are already disclosed. The key is the attribute identifier (for instance `pbdf.pbdf.email.email` for an e-mail attribute issued by the Privacy By Design foundation). The value is the value of the attribute of the user. One can obtain this value from Redux in `divaReducer.attributes`.
    - `requiredAttribute:` The identifier of attribute that needs to be disclosed.
    - `requiredAttributeLabel:` The label shown to the user when requesting this attribute.

## IRMA

For more information about IRMA, see: https://privacybydesign.foundation/irma/

The IRMA client apps can be downloaded from their respective app stores:

- [Apple App Store](https://itunes.apple.com/nl/app/irma-authentication/id1294092994?mt=8)
- [Google Play Store](https://play.google.com/store/apps/details?id=org.irmacard.cardemu)

Other components in the IRMA ecosystem include:

- [IRMA Android/iOS app](https://github.com/privacybydesign/irma_mobile)
- [IRMA server](https://irma.app/docs/irma-server/)
- [IRMA Golang library](https://github.com/privacybydesign/irmago)

<!-- vim: set ts=4: et: -->
