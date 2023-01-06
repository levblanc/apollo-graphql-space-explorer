import React from 'react';
import styled from '@emotion/styled';
import { useApolloClient } from '@apollo/client';

import { menuItemClassName } from '../components/menu-item';
import { isLoggedInVar } from '../cache';
import { ReactComponent as ExitIcon } from '../assets/icons/exit.svg';
import { TOKEN, USER_ID } from '../constants';
import { colors } from '../styles';

const StyledButton = styled('button')([
  menuItemClassName,
  {
    background: 'none',
    border: 'none',
    borderRadius: 10,
    padding: 5,
    '&:hover': {
      cursor: 'pointer',
      color: 'white',
      background: colors.secondary,
      svg: {
        fill: 'white',
      },
    },
  },
]);

const LogoutButton: React.FC<any> = () => {
  const client = useApolloClient();
  const handleLogout = () => {
    // Evict and garbage-collect the cached user object
    client.cache.evict({ fieldName: 'me' });
    client.cache.gc();

    // Remove user details from local storage
    localStorage.removeItem(TOKEN);
    localStorage.removeItem(USER_ID);

    // Set the logged-in status to false
    isLoggedInVar(false);
  };

  return (
    <StyledButton data-testid='logout-button' onClick={handleLogout}>
      <ExitIcon />
      Logout
    </StyledButton>
  );
};

export default LogoutButton;
