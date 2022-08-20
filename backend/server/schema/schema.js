const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
  GraphQLEnumType,
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

//create Root queries object to make a specified queries to GQL Objects - GET - for instance show 'client' information by ID, or get all Clients
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

//Mutations for objects - add Client, add Project etc,
const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    // ADD a Client
    addClient: {
      type: ClientType, // create Client with type ClientType
      args: {
        name: { type: GraphQLNonNull(GraphQLString) }, // 'GraphQLNonNull' enforce that values are never null and can ensure an error is raised if this ever occurs during a request
        email: { type: GraphQLNonNull(GraphQLString) },
        phone: { type: GraphQLNonNull(GraphQLString) },
      },

      // in 'resolve' we're creating new Client using Mongoose - passing data (GQL query arguments - from a frontend form, for instance) to DB
      resolve(parent, args) {
        const client = new Client({
          name: args.name,
          email: args.email,
          phone: args.phone,
        })
        return client.save() // save to DB
      },
    },

    //DELETE a Client
    deleteClient: {
      type: ClientType,
      args: {
        id: { type: GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        return Client.findByIdAndRemove(args.id)
      },
    },

    //ADD a Project
    addProject: {
      type: ProjectType,
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
        description: { type: GraphQLNonNull(GraphQLString) },
        status: {
          //* ENUM for statuses matching
          type: new GraphQLEnumType({
            name: 'ProjectStatus', //! 'name' should be unique
            values: {
              new: { value: 'Not Started' },
              progress: { value: 'In Progress' },
              completed: { value: 'Completed' },
            },
          }),
          defaultValue: 'Not Started',
        },
        clientId: { type: GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        const project = new Project({
          name: args.name,
          description: args.description,
          status: args.status,
          clientId: args.clientId,
        })
        return project.save()
      },
    },

    //DELETE a project
    deleteProject: {
      type: ProjectType,
      args: {
        id: { type: GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        return Project.findByIdAndRemove(args.id)
      },
    },

    //UPDATE the project
    updateProject: {
      type: ProjectType,
      args: {
        id: { type: GraphQLNonNull(GraphQLID) },
        name: { type: GraphQLString }, // if name or description is not specified - it's not throw the 'null' error during update
        description: { type: GraphQLString },
        status: {
          type: new GraphQLEnumType({
            name: 'ProjectStatusUpdate', //! 'name' should be unique
            values: {
              new: { value: 'Not Started' },
              progress: { value: 'In Progress' },
              completed: { value: 'Completed' },
            },
          }),
        },
      },
      resolve(parent, args) {
        return Project.findByIdAndUpdate(
          args.id,
          {
            $set: {
              // setting new values, if they come from frontend
              name: args.name,
              description: args.description,
              status: args.status,
            },
          },
          { new: true } //! ???? if project with specified id is not in DB it's gonna create new project  ????
        )
      },
    },
  },
})

// export Query
module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation,
})
