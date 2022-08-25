import { useState } from 'react'
import { useMutation } from '@apollo/client'

import { GET_PROJECT } from '../../queries/projectQueries'
import { UPDATE_PROJECT } from '../../mutations/projectMutations'

export default function EditProjectForm({ project }) {
  //* get the initial data for states from parent component
  const [name, setName] = useState(project.name)
  const [description, setDescription] = useState(project.description)

  /*   TODO: 'addProject' Schema can be changed  - change 'GraphQLEnumType' for project statuses to 'GraphQLString'
  otherwise we can't pass 'project.status' as default value - as it's value of schema's ENUM key (new, progress, competed), 
  but we need to pass enum key of Project status when adding/updating Project */
  const [status, setStatus] = useState('') //! the value won't be pre-filled

  // define update project mutation
  const [updateProject] = useMutation(UPDATE_PROJECT, {
    variables: {
      //* name, description, status - come from the form values
      id: project.id,
      name: name,
      description: description,
      status: status,
    },

    //* refetch GET_PROJECT query - and pass in the id, that way it just updates right away.
    refetchQueries: [{ query: GET_PROJECT, variables: { id: project.id } }],
  })

  const onSubmit = (e) => {
    e.preventDefault()
    if (!name || !description || !status) {
      return alert('Please fill out all fields')
    }

    updateProject(name, description, status)
  }

  return (
    <div className="mt-5">
      <h3>Update Project Details</h3>
      <form onSubmit={onSubmit} action="">
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input
            type="text"
            className="form-control"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            className="form-control"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>
        <div className="mb-3">
          <label className="form-label">Status</label>
          <select
            id="status"
            className="form-select"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="" disabled>
              Select Project Status
            </option>
            <option value="new">Not Started</option>
            <option value="progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  )
}
