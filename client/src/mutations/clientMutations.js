import { gql } from '@apollo/client'

const DELETE_CLIENT = gql`
  # set the data to be passed in and its type
  mutation deleteClient($id: ID!) {
    # call the mutation with arguments and get values to return after
    deleteClient(id: $id) {
      id
      name
      email
      phone
    }
  }
`

export { DELETE_CLIENT }
