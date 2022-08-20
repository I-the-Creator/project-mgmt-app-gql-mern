import { Link, useParams } from 'react-router-dom'
import { useQuery } from '@apollo/client'

import { GET_PROJECT } from '../queries/projectQueries'
import Spinner from '../components/Spinner/Spinner'

const Project = () => {
  // get the ID from URL
  const { id } = useParams()

  // make a query to DB by id, get data from query.
  const { loading, error, data } = useQuery(GET_PROJECT, {
    variables: { id },
  })

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
        <div className="mx-auto w-75 card p-5">
          <Link to="/" className="btn btn-light btn-sm w-25 d-inline ms-auto">
            Back
          </Link>
          <h1>{data.project.name}</h1>
          <p>{data.project.description}</p>
          <h5 className="mt-3">Project Status</h5>
          <p className="">{data.project.status}</p>

          <ClientInfo client={data.project.client} />
        </div>
      )}
    </>
  )
}

export default Project
