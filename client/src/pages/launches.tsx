import React, { Fragment, useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import * as GetLaunchListTypes from './__generated__/GetLaunchList';
import { LaunchTile, Header, Button, Loading } from '../components';

export const LAUNCH_TILE_DATA = gql`
  fragment LaunchTile on Launch {
    __typename
    id
    isBooked
    rocket {
      id
      name
    }
    mission {
      name
      missionPatch
    }
  }
`;

export const GET_LAUNCHES = gql`
  query GetLaunchList($after: String) {
    launches(after: $after) {
      cursor
      hasMore
      launches {
        ...LaunchTile
      }
    }
  }
  ${LAUNCH_TILE_DATA}
`;

interface LaunchesProps {}

const Launches: React.FC<LaunchesProps> = () => {
  const { data, loading, error, fetchMore } = useQuery<
    GetLaunchListTypes.GetLaunchList,
    GetLaunchListTypes.GetLaunchListVariables
  >(GET_LAUNCHES);

  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const handleLoadMore = async () => {
    setIsLoadingMore(true);

    await fetchMore({
      variables: {
        after: data?.launches.cursor,
      },
    });

    setIsLoadingMore(false);
  };

  if (loading) return <Loading />;
  if (error) return <p>ERROR</p>;
  if (!data) return <p>Not found</p>;

  return (
    <Fragment>
      <Header />
      {data.launches &&
        data.launches.launches &&
        data.launches.launches.map((launch: any) => {
          return <LaunchTile key={launch.id} launch={launch} />;
        })}
      {data.launches &&
        data.launches.hasMore &&
        (isLoadingMore ? (
          <Loading />
        ) : (
          <Button onClick={handleLoadMore}>Load More</Button>
        ))}
    </Fragment>
  );
};

export default Launches;
