import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client'

import Header from './components/Header/Header'
import Clients from './components/Clients/Clients'
import AddClientModal from './components/AddClientModal/AddClientModal'

// Enable cache and define custom 'merge' function for cache updates
const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        clients: {
          merge(existing, incoming) {
            return incoming
          },
        },
        projects: {
          merge(existing, incoming) {
            return incoming
          },
        },
      },
    },
  },
})

// Apollo client initialization
const client = new ApolloClient({
  uri: 'http://localhost:5000/graphql', // GraphQL server
  cache: cache,
})

const App = () => {
  return (
    <>
      <ApolloProvider client={client}>
        <Header />
        <div className="container">
          <AddClientModal />
          <Clients />
        </div>
      </ApolloProvider>
    </>
  )
}

export default App
