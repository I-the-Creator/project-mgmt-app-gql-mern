import { FaTrash } from 'react-icons/fa'

import { useMutation } from '@apollo/client'

import { DELETE_CLIENT } from '../../mutations/clientMutations'
import { GET_CLIENTS } from '../../queries/clientQueries'
import { GET_PROJECTS } from '../../queries/projectQueries'

const ClientRow = ({ client }) => {
  //* define deleting client mutation and pass in arguments(values) whish will feed the mutation query - 'client id'
  const [deleteClient] = useMutation(DELETE_CLIENT, {
    variables: { id: client.id },
    refetchQueries: [{ query: GET_CLIENTS }, { query: GET_PROJECTS }], // refetch queries as projects and clients have to be rerendered when client is deleted with it's projects

    //* Update client on Client delete without updating list of projects
    // update(cache, { data: { deleteClient } }) {
    //   const { clients } = cache.readQuery({
    //     query: GET_CLIENTS,
    //   })
    //   cache.writeQuery({
    //     query: GET_CLIENTS,
    //     data: {
    //       clients: clients.filter((client) => client.id !== deleteClient.id),
    //     },
    //   })
    // },
  })

  return (
    <tr>
      <td>{client.name}</td>
      <td>{client.email}</td>
      <td>{client.phone}</td>
      <td>
        <button className="btn btn-danger btn-sm" onClick={deleteClient}>
          <FaTrash />
        </button>
      </td>
    </tr>
  )
}
export default ClientRow
