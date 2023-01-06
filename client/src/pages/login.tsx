import { gql, useMutation } from '@apollo/client';
import React from 'react';
import { LoginForm, Loading } from '../components';
import { TOKEN, USER_ID } from '../constants';
import * as LoginTypes from './__generated__/Login';

export const LOGIN_USER = gql`
  mutation Login($email: String!) {
    login(email: $email) {
      id
      token
    }
  }
`;

export default function Login() {
  const [login, { loading, error }] = useMutation<
    LoginTypes.Login,
    LoginTypes.LoginVariables
  >(LOGIN_USER, {
    onCompleted({ login }) {
      if (login) {
        localStorage.setItem(TOKEN, login.token as string);
        localStorage.setItem(USER_ID, login.id as string);
          login.token as string
      }
    },
  });

  if (loading) return <Loading />;
  if (error) return <p>An error occurred</p>;

  return <LoginForm login={login} />;
}
