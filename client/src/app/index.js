import React, { Component } from 'react'

// Apollo dependencies
import { AsyncStorage } from 'react-native'
import { ApolloProvider } from 'react-apollo'
import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { ApolloLink } from 'apollo-link'
import { withClientState } from 'apollo-link-state'
import { InMemoryCache } from 'apollo-cache-inmemory'
import fetch from 'cross-fetch'
// import merge from 'lodash.merge';

// Custom router to work with web and mobile
import { Router } from './../modules'

// Native-base
import { StyleProvider } from 'native-base'
import getTheme from './native-base-theme/components'
import variables from './native-base-theme/variables/material'

// I can do this with barelling, but might be better to separate these concerns
import { authResolvers, GRAPHQLAPI } from './../modules'

// Routes
import { UserRoutes } from './../modules'

// Fix for self.fetch undefined in react-native
global.self = global;

const cache = new InMemoryCache()
const httpLink = new HttpLink({ uri: GRAPHQLAPI, fetch })
const stateLink = withClientState({
  ...authResolvers,
  cache
})

const client = new ApolloClient({
  link: ApolloLink.from([stateLink, httpLink]),
  cache,
  storage: AsyncStorage
})

export class App extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <StyleProvider style={getTheme(variables)}>
          <Router>
            <UserRoutes/>
          </Router>
        </StyleProvider>
      </ApolloProvider>
    )
  }
}
