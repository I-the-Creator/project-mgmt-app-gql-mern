// Apollo
import { useQuery } from '@apollo/client'

import ClientRow from '../ClientRow/ClientRow'

// Query to GQL server
import { GET_CLIENTS } from '../../queries/clientQueries'
import Spinner from '../Spinner/Spinner'

const Clients = () => {
  const { loading, error, data } = useQuery(GET_CLIENTS) // returned data. errors and request status

  if (loading) return <Spinner />
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
        <table className="table table-hover mt-3">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {data.clients.map((client) => (
              <ClientRow key={client.id} client={client} />
            ))}
          </tbody>
        </table>
      )}
    </>
  )
}

export default Clients
