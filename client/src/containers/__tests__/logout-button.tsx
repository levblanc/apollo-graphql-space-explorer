import React from 'react';
import LogoutButton from '../logout-button';

import { renderApollo, cleanup, fireEvent } from '../../test-utils';
import { cache, isLoggedInVar } from '../../cache';
import { TOKEN, USER_ID } from '../../constants';

describe('logout button', () => {
  // automatically unmount and cleanup DOM after the test is finished.
  afterEach(cleanup);

  it('renders logout button', async () => {
    renderApollo(<LogoutButton />);
  });

  it('complete logout', async () => {
    isLoggedInVar(true);
    localStorage.setItem(TOKEN, window.btoa('testTokenValue'));
    localStorage.setItem(USER_ID, window.btoa('abc123'));
    const { getByTestId } = renderApollo(<LogoutButton />, { cache });
    fireEvent.click(getByTestId('logout-button'));
    expect(isLoggedInVar()).toBeFalsy();
    expect(localStorage.getItem(TOKEN)).toBeNull();
    expect(localStorage.getItem(USER_ID)).toBeNull();
  });
});
