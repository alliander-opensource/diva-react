# diva-react

This repository contains a library that can be used with the DIVA backend SDK [diva-irma-js](https://github.com/Alliander/diva-irma-js) to easily integrate [IRMA attributes](https://privacybydesign.foundation/irma-verifier/) into NodeJS based applications.

See [diva-js-reference-3p-frontend](https://github.com/Alliander/diva-js-reference-3p-frontend) for an example implementation of this library that also makes use of [diva-js-reference-3p-backend](https://github.com/Alliander/diva-js-reference-3p-backend) as an example backend with [diva-irma-js](https://github.com/Alliander/diva-irma-js).

IRMA is a decentralized, attribute based Identity Management protocol that allows easy and fine-grained authentication (and based on specific attributes) authorization. Attributes are issued by trusted issuers and therefore provide easy validation of users.

## Features

This library can be used in a React frontend to create and visualise IRMA disclosure, issuing and signing sessions.

This library allows you to:
- Only show pages if certain attributes are disclosed using [React higher order components](https://reactjs.org/docs/higher-order-components.html)
- Visualise signing and issuing sessions with React Components
  - This is done with `<Sign /> and <IssueCredentials />`), which handle IRMA sessions by showing a QR code and adapting to user interaction
- Store IRMA-session related information in a [Redux](https://github.com/reduxjs/react-redux) reducer
- Makes sure IRMA sessions are correctly handled with a [Background saga](https://redux-saga.js.org/)

# Installation

Diva-react requires React, Redux and Redux-saga.

Installation can be done with:

```
    yarn add https://github.com/alliander/diva-react
```

## Initial setup

Diva-react needs to be added to your existing reducers and sagas. See [diva-js-reference-3p-frontend](https://github.com/Alliander/diva-js-reference-3p-frontend) for an example setup.

### Reducer configuration

To add it to your reducers, do something like this in your `src/reducers/index.js`:

```
    import { combineReducers } from 'redux';

    import yourOwnReducer from './your-own-reducer';
    import { divaReducer } from '../diva-react';

    const rootReducer = combineReducers({
      yourOwnReducer,
      divaReducer,
    });

    export default rootReducer;
```

You now have access to a divaReducer object in your Redux state, which contains information about running IRMA sessions. Generally it isn't needed to do anything with it, since it's mainly used within Diva-react's components.

### Saga configuration

To add it to your sagas, do something like this in your `src/sagas/index.js`:

```
    import { all } from 'redux-saga/effects';

    import yourOwnSaga from './yourOwnSaga';
    import { divaSaga } from '../diva-react';

    export default function* rootSaga() {
      yield all([
        yourOwnSaga(),
        divaSaga(),
      ]);
    }
```

You can now fire `START_SESSION` and `ABANDON_SESSION` redux actions, which will use this saga to start IRMA sessions in the background. Generally it's recommended to use Diva-react's exposed components to start IRMA sessions (instaed of firing these actions directly).

`divaSaga()` assumes that the [diva-irma-js](https://github.com/Alliander/diva-irma-js) backend can be found under `/api`. If you use a different host/path for the backend, you can provide a `baseUrl` as an argument do `divaSaga()`. Make sure that you send the right CORS headers in case the backend is running on a different domain.


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
<Route path="/my-account”
	component={ WithSimpleDivaAuthorization('pbdf.pbdf.email.email')(MyAccount) }/>
```

Now, the `MyAccount` component will only be shown *after* the user has disclosed his/her email address attribute. Any container component can be wrapped with the `WithSimpleDivaAuthorization` component to control identity requirements. See the App container of [diva-js-reference-3p-frontend](https://github.com/Alliander/diva-js-reference-3p-frontend) for an example.

Note: for more complex scenarios, use the `WithDivaAuthorization` higher order component, see the API reference below.

## Signing

To show a QR code to start an IRMA signing session, use the following component:

```
import {Sign } from 'diva-react';
<Sign
  requiredAttributes={required_attributes}
  message={message_to_be_signed}
  viewId="unique_id_for_this_view"
/>
```

The Sign component required three properties:
- `requiredAttributes` contains the list of required attributes in the signature, which is defined as 'a set of conjunctions containing disjunctions, a concept that is explained [at the IRMA webpage](http://credentials.github.io/protocols/irma-protocol/#verification)
- `message` contains the message that will be signed by the user
- `viewId` needs to be a unique id to separate this IRMA session from other running IRMA sessions in the same application


After the IRMA session is completed, an `SESSION_COMPLETED` action will be fired, which results in a `proofResult` and a `signature` object in `divaReducer.sessions['viewId'] (where `viewId` was passed as property to the Sign component). In this way, you can use the `signature` and `proofResult` objects in your React component as properties mapped from the Redux state.

Additionally, you can watch in your sagas for an `SESSION_COMPLETED` event and start another saga. For example:

```
    import { types as divaTypes } from 'diva-react';
    takeEvery(action => action.type === divaTypes.SESSION_COMPLETED && action.viewId === 'your_unique_view_id', yourSaga),
```

# API reference


## IRMA

For more information about IRMA, see: https://privacybydesign.foundation/irma/

The IRMA client apps can be downloaded from their respective app stores:

- [Apple App Store](https://itunes.apple.com/nl/app/irma-authentication/id1294092994?mt=8)
- [Google Play Store](https://play.google.com/store/apps/details?id=org.irmacard.cardemu)

Other components in the IRMA ecosystem include:

- [IRMA Android/iOS app](https://github.com/privacybydesign/irma_mobile)
- [IRMA API server](https://github.com/privacybydesign/irma_api_server)
