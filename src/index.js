import React from 'react';
import ReactDOM from 'react-dom';
import Foo, { QUERY } from './Foo';

import ApolloClient from 'apollo-client'
import { ApolloProvider } from 'react-apollo'

class MockNetworkInterface {
  query(request) {
    console.group('MockNetworkInterface.query')
    console.log('request.variables', request.variables)
    console.groupEnd()
    return new Promise((resolve, reject) => {
      resolve({
        data: {
          foo: {
            id: request.variables.fooID,
            __typename: 'Foo'
          }
        }
      })
    })
  }
}

const networkInterface = new MockNetworkInterface()
const client = new ApolloClient({ networkInterface })

let observableQuery;
let subscription;
const render = ({ fooID, active, message }) => {
  if (!active) {
    if (subscription) {
      subscription.unsubscribe();
    }
  } else {
    const options = {
      forceFetch: true,
      variables: { fooID },
      pollInterval: 2000,
    };
    console.log(options)

    if (observableQuery) {
      observableQuery.setOptions(options);
    } else {
      observableQuery = client.watchQuery({ query: QUERY, ...options });
      subscription = observableQuery.subscribe({
        next(data) {
          console.log({ data });
        }
      });
    }
  }
  console.log(message)
}

render({
  fooID: 1,
  active: false,
  message: 'booted, will start polling for id=1 in ~1000ms'
})

setTimeout(() => {
  render({
    fooID: 1,
    active: true,
    message: 'polling started, will poll for id=1 for ~5000ms'
  })
}, 1000)


setTimeout(() => {
  render({
    fooID: null,
    active: false,
    message: 'polling for id=1 ended, will idle for ~5000ms'
  })
}, 6000)

setTimeout(() => {
  render({
    fooID: 2,
    active: true,
    message: 'now polling for id=2 indefinitely (but it doesnt work. it polls for id=1)'
  })
}, 11000)
