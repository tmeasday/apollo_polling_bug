import React from 'react';
import gql from 'graphql-tag'
import { graphql } from 'react-apollo'

export const QUERY = gql`
  query($fooID: Int!) { foo(id: $fooID) { id } }
`

const withFoo = graphql(QUERY, {
  skip: ownProps => ownProps.active !== true,
  options: (ownProps) => {
    console.group('withFoo.options')
    console.log('  ownProps.fooID', ownProps.fooID)
    console.groupEnd()
    return {
      forceFetch: true,
      variables: {
        fooID: ownProps.fooID,
      },
      pollInterval: 2000,
    }
  },
  props: ({ data }) => {
    console.log('withFoo.props.data', data)
    return {
      foo: data.loading ? 'Loading...' : data.foo.id,
    }
  },
})

const App = ({ message, foo, fooID }) => {
  console.log('App.render: message=', message)
  return (
    <p>
      message: {message}<br />
      fooID prop: {JSON.stringify(fooID)}<br />
      graphql result for foo.id: {JSON.stringify(foo)}<br />
    </p>
  )
}

export default withFoo(App);
