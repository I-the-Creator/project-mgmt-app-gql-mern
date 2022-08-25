import { useState } from 'react'
import { FaUser } from 'react-icons/fa'
import { useMutation } from '@apollo/client'

import { ADD_CLIENT } from '../../mutations/clientMutations'
import { GET_CLIENTS } from '../../queries/clientQueries'

const AddClientModal = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')

  //* add client mutation; define variables which are used for query; pass the returned data to 'addClient' variable
  const [addClient] = useMutation(ADD_CLIENT, {
    variables: { name, email, phone },

    //* update cache and rerender list of clients after 'addClient' mutation - 'data' - values returned from DB after 'addClient' request
    update(cache, { data: { addClient } }) {
      console.log(addClient) // DEBUG
      //* read from the cached GET_CLIENTS and pass it to 'client' variable
      const { clients } = cache.readQuery({
        query: GET_CLIENTS,
      })

      //* WRITE TO the cached GET_CLIENTS new data after adding client - - spread (concat) new data to cached data
      cache.writeQuery({
        query: GET_CLIENTS,
        // data: { clients: clients.concat([addClient]) },
        data: { clients: [...clients, addClient] },
      })
    },
  })

  const onSubmit = (e) => {
    e.preventDefault()
    // console.log(name, email, phone)  // DEBUG
    if (((name === '') | (email === ''), phone === '')) {
      return alert('Please fill in all fields')
    }

    //* call the 'addClient' function to rin mutation
    addClient(name, email, phone)

    //Clean up the form
    setName('')
    setEmail('')
    setPhone('')
  }

  return (
    <>
      <button
        type="button"
        className="btn btn-secondary"
        data-bs-toggle="modal"
        data-bs-target="#addClientModal"
      >
        <div className="d-flex align-items-center">
          <FaUser className="icon" />
          <div>Add Client</div>
        </div>
      </button>

      <div
        className="modal fade"
        id="addClientModal"
        aria-labelledby="addClientModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="addClientModalLabel">
                Add Client
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
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Phone</label>
                  <input
                    type="text"
                    className="form-control"
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>

                <button
                  className="btn btn-secondary"
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
  )
}

export default AddClientModal
