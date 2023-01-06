import React from 'react';
import { gql, useMutation, useReactiveVar, Reference } from '@apollo/client';

import { GET_LAUNCH_DETAILS } from '../pages/launch';
import Button from '../components/button';
import { cartItemsVar } from '../cache';
import * as LaunchDetailTypes from '../pages/__generated__/LaunchDetails';
import { USER_ID } from '../constants';

export { GET_LAUNCH_DETAILS };

export const CANCEL_TRIP = gql`
  mutation cancelTrip($launchId: ID!) {
    cancelTrip(launchId: $launchId) {
      code
      success
      message
      launches {
        id
        isBooked
      }
    }
  }
`;

interface ActionButtonProps
  extends Partial<LaunchDetailTypes.LaunchDetails_launch> {}

const CancelTripButton: React.FC<ActionButtonProps> = ({ id }) => {
  const [handleCancelTrip, { loading, error }] = useMutation(CANCEL_TRIP, {
    variables: { launchId: id },
    update(cache, { data: { cancelTrip } }) {
      const launch = cancelTrip.launches[0];
      cache.modify({
        id: cache.identify({
          __typename: 'User',
          id: localStorage.getItem(USER_ID),
        }),
        fields: {
          trips(existingTrips: Reference[], { readField }) {
            return existingTrips.filter((tripRef) => {
              return readField('id', tripRef) !== launch.id;
            });
          },
        },
      });
    },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>An error occurred</p>;

  return (
    <Button onClick={() => handleCancelTrip()} data-testid={'action-button'}>
      Cancel This Trip
    </Button>
  );
};

const ToggleTripButton: React.FC<ActionButtonProps> = ({ id }) => {
  const cartItems = useReactiveVar(cartItemsVar);
  const isInCart = id ? cartItems.includes(id) : false;

  const handleToggleTrip = () => {
    if (id) {
      const cartItemList: any[] = isInCart
        ? cartItems.filter((itemId) => itemId !== id)
        : [...cartItems, id];

      cartItemsVar(cartItemList);
    }
  };

  return (
    <Button onClick={handleToggleTrip} data-testid={'action-button'}>
      {isInCart ? 'Remove from Cart' : 'Add to Cart'}
    </Button>
  );
};

const ActionButton: React.FC<ActionButtonProps> = ({ isBooked, id }) =>
  isBooked ? <CancelTripButton id={id} /> : <ToggleTripButton id={id} />;

export default ActionButton;
