const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLSchema,
  GraphQLList,
} = require('graphql')

// const { projects, clients } = require('../sampleData.js')   // dummy data

//Mongoose Models for querying data
const Project = require('../models/Project')
const Client = require('../models/Client')

//Client type
const ClientType = new GraphQLObjectType({
  name: 'Client',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    phone: { type: GraphQLString },
  }),
})

//Project type
const ProjectType = new GraphQLObjectType({
  name: 'Project',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    status: { type: GraphQLString },

    // get the Client info for Project
    client: {
      type: ClientType,
      // 'resolver' functions
      resolve(parent, args) {
        // return clients.find((client) => client.id === parent.clientId) // find in DB client by project(parent) ID, passed in query arguments, as a client is a child of a project
        return Client.findById(parent.clientId) // return Client data based on Project's clientId
      },
    },
  }),
})

//create Root queries object to make a specified queries to GQL Objects - for instance show 'client' information by ID, or get all Clients
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    projects: {
      type: GraphQLList(ProjectType), // use GraphQLList as we going to get the data for all Client - list of
      resolve(parent) {
        // return projects // return all project from dummy DB
        return Project.find()
      },
    },

    project: {
      type: ProjectType,
      args: { id: { type: GraphQLID } },
      // 'resolver' function
      resolve(parent, args) {
        // return projects.find((project) => project.id === args.id) // find in DB client by id, passed in query arguments
        return Project.findById(args.id)
      },
    },

    clients: {
      type: GraphQLList(ClientType), // use GraphQLList as we going to get the data for all Client - list of
      resolve(parent) {
        // return clients //return all clients from dummy DB
        return Client.find()
      },
    },

    client: {
      type: ClientType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        // return clients.find((client) => client.id === args.id) // find client by id passed in query arguments
        return Client.findById(args.id)
      },
    },
  },
})

// export Query
module.exports = new GraphQLSchema({
  query: RootQuery,
})
