import React, { Component } from 'react'
import { View, StyleSheet } from 'react-native'

import { FormInput, FormLabel } from './../../components'

import { LoginBox } from '../components'
import { AuthMutation } from './../graphql'
// import { loginStyles as styles } from './../styles'

export class Login extends Component {
  state = {
    email: "",
    password: "",
    error: null
  }

  login(triggerMutation) {
    // return a function that will make the mutation trigger accessible
    // This allows us to get the result of the mutation
    return async () => {
      const result = await triggerMutation()

      // Show basic error
      if(result.error) {
        this.setState({
          ...this.state,
          error: result.error
        })
      } else {
        // Else login was a success, so remove error and redirect
        this.setState({
          ...this.state,
          error: null
        })
      }
    }
  }

  render() {
    return (
      <View style={styles.loginContainer}>
        <LoginBox>
          <AuthMutation email={this.state.email} password={this.state.password}>
          { triggerMutation => (
            <View>
              <FormLabel>Email</FormLabel>
              <FormInput onChangeText={text => this.setState({...this.state, email: text})}/>
              <FormLabel>Password</FormLabel>
              <FormInput onChangeText={text => this.setState({...this.state, password: text})}/>
            </View>
          )}
          </AuthMutation>
        </LoginBox>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  loginContainer: {
    justifyContent: 'center',
    flex: 1,
    alignItems: 'center'
  }
})
