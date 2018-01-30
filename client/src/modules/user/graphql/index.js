import gql from 'graphql-tag'
import { Component } from 'react'
import { graphql } from 'react-apollo'

class LoginComponent extends Component {
  triggerMutation = () => {
    const { email, password, onLogin } = this.props
    return onLogin(email, password)
  }

  render() {
    const { children } = this.props

    // Here we pass the function to trigger the mutation to the children of the component
    return children && children(this.triggerMutation)
  }
}

const LOGIN_MUTATION = gql`
  mutation login(
    $email: String!,
    $password: String!
  ) {
    login(email: $email, password: $password) @client
  }
`

const mutationResultToLogin = () =>
  result => {
    if (result.errors || !result.data) {
      throw new Error("Failed to mutate")
    }

    return result.data.login
  }

// This maps the mutation function generated by graphql
// to make it accessible in the components props
const mapMutationToProps = ({mutate}) => ({
  onLogin: (email, password) => {
    return mutate({
      variables: { email, password }
    }).then(mutationResultToLogin())
  }
})

export const LoginMutation  = graphql(LOGIN_MUTATION, {
  props: mapMutationToProps,
})(LoginComponent)
