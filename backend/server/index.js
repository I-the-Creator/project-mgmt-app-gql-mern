// connect Express server
const express = require('express')

// enable .env file
require('dotenv').config()

// CORS
const cors = require('cors')

//Enable colors for terminal (log) messages
const colors = require('colors')

// GraphQL for express
const { graphqlHTTP } = require('express-graphql')

//import GQL schema
const schema = require('./schema/schema')

// import Mongo DB connection configuration
const connectDB = require('./config/db')

const port = process.env.PORT || 5000

// connect express
const app = express()

// Connect to database
connectDB()

//Enable CORS middleware
app.use(cors())

// connect GraphQL
app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    graphiql: process.env.NODE_ENV === 'development', // use graphiql only in 'development' mode
  })
)

app.listen(port, console.log(`Server running on port ${port}`))
