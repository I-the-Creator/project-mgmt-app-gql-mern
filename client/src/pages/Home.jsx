import AddClientModal from '../components/AddClientModal/AddClientModal'
import Clients from '../components/Clients/Clients'
import Projects from '../components/Projects/Projects'

const Home = () => {
  return (
    <>
      <div className="d-flex gap-3 mb-4">
        <AddClientModal />
      </div>
      <Projects />
      <hr />
      <Clients />
    </>
  )
}

export default Home
