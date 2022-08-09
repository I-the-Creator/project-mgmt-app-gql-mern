const express = require('express')

// GraphQL for express
const { graphqlHTTP } = require('express-graphql')

//connect GQL schema
const schema = require('./schema/schema')

// enable .env file
require('dotenv').config()

const port = process.env.PORT || 5000

// connect express
const app = express()

// connect GraphQL
app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    graphiql: process.env.NODE_ENV === 'development', // use graphiql only in 'development' mode
  })
)

app.listen(port, console.log(`Server running on port ${port}`))
