import { useState } from 'react'
import { FaList } from 'react-icons/fa'
import { useMutation, useQuery } from '@apollo/client'

import { GET_PROJECTS } from '../../queries/projectQueries'
import { GET_CLIENTS } from '../../queries/clientQueries'

import { ADD_PROJECT } from '../../mutations/projectMutations'

const AddProjectModal = () => {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [clientId, setClientId] = useState('')
  const [status, setStatus] = useState('new') // ENUM from backend addProject schema

  //* add client mutation; define variables which are used for query; pass the returned data to 'addClient' variable
  const [addProject] = useMutation(ADD_PROJECT, {
    variables: { name, description, clientId, status },

    //* update cache and rerender list of projects after 'addProject' mutation - 'data' - values returned from DB after 'addProject' request
    update(cache, { data: { addProject } }) {
      console.log(addProject) // DEBUG
      //* read from the cached GET_PROJECTS and pass it to 'projects' variable
      const { projects } = cache.readQuery({
        query: GET_PROJECTS,
      })

      //* WRITE TO the cached ET_PROJECTS new data after adding project - spread (concat) new data to cached data
      cache.writeQuery({
        query: GET_PROJECTS,
        // data: { clients: clients.concat([addClient]) },
        data: { projects: [...projects, addProject] },
      })
    },
  })

  // Get clients for select
  const { loading, error, data } = useQuery(GET_CLIENTS)

  const onSubmit = (e) => {
    e.preventDefault()
    // console.log(name, email, phone)  // DEBUG
    if (((name === '') | (description === ''), status === '')) {
      return alert('Please fill in all fields')
    }

    //* call the 'addProject' function to rin mutation
    addProject(name, description, clientId, status)

    //Clean up the form
    setName('')
    setDescription('')
    setStatus('new')
    setClientId('')
  }

  // if GET-CLIENTS query not completed - return nothing
  if (loading) return null

  // if error when requesting Clients - return error message
  if (error)
    return (
      <>
        <h4>Something Went Wrong!</h4>
        <h5>{error.message}</h5>
      </>
    )

  return (
    <>
      {!loading && !error && (
        <>
          <button
            type="button"
            className="btn btn-primary"
            data-bs-toggle="modal"
            data-bs-target="#addCProjectModal"
          >
            <div className="d-flex align-items-center">
              <FaList className="icon" />
              <div>New Project</div>
            </div>
          </button>

          <div
            className="modal fade"
            id="addCProjectModal"
            aria-labelledby="addProjectModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="addCProjectModalLabel">
                    New Project
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  <form onSubmit={onSubmit}>
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

                    <div className="mb-3">
                      <label className="form-label">Client</label>
                      <select
                        id="clientId"
                        className="form-select"
                        value="clientId"
                        onChange={(e) => setClientId(e.target.value)}
                      >
                        <option value="" disabled>
                          Select Client
                        </option>
                        {data.clients.map((client) => (
                          <option key={client.id} value={client.id}>
                            {client.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <button
                      className="btn btn-primary"
                      type="submit"
                      data-bs-dismiss="modal" // to close modal on Submit
                    >
                      Submit
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default AddProjectModal
