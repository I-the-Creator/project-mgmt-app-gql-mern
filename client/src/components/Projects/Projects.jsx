// Apollo
import { useQuery } from '@apollo/client'

import { GET_PROJECTS } from '../../queries/projectQueries'
import ProjectCard from '../ProjectCard/ProjectCard'

import Spinner from '../Spinner/Spinner'

const Projects = () => {
  // get the data and request status
  const { loading, error, data } = useQuery(GET_PROJECTS)

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
      {data.projects.length > 0 ? (
        <div className="row mt-4">
          {data.projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <p>No Projects</p>
      )}
    </>
  )
}

export default Projects
