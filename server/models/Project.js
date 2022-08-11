const mongoose = require('mongoose')

const ProjectSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  description: {
    type: String,
  },
  status: {
    type: String,
    enum: ['Not Started', 'In Progress', 'Completed'],
  },
  clientId: {
    type: mongoose.Schema.Types.ObjectId, // ObjectId is created automatically when we create a new record in DB - 'clientId' has type of that object
    ref: 'Client', // and 'clientID' should pertain to the 'Client' model - relates to
  },
})

module.exports = mongoose.model('Project', ProjectSchema)
