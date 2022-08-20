import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client'

import Header from './components/Header/Header'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import Project from './pages/Project'

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
        <Router>
          <Header />
          <div className="container">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/projects/:id" element={<Project />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </Router>
      </ApolloProvider>
    </>
  )
}

export default App
