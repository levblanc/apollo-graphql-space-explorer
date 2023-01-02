import { paginateResults } from './utils';

const resolvers = {
  Query: {
    launches: async (_, { pageSize = 20, after }, { dataSources }) => {
      const allLaunches = await dataSources.launchAPI.getAllLaunches();
      allLaunches.reverse();

      const launches = paginateResults({
        after,
        pageSize,
        results: allLaunches,
      });

      return {
        launches,
        cursor: launches.length ? launches[launches.length - 1].cursor : null,
        // if the cursor at the end of the paginated results is the same as the
        // last item in _all_ results, then there are no more results after this
        hasMore: launches.length
          ? launches[launches.length - 1].cursor !==
            allLaunches[allLaunches.length - 1].cursor
          : false,
      };
    },
    launch: (_, { id }, { dataSources }) => {
      return dataSources.launchAPI.getLaunchById(id);
    },
    me: (_, __, { dataSources }) => {
      return dataSources.userAPI.findOrCreateUser();
    },
  },
  Mission: {
    missionPatch: (
      { missionPatchSmall, missionPatchLarge },
      { size } = { size: 'LARGE' }
    ) => {
      return size === 'SMALL' ? missionPatchSmall : missionPatchLarge;
    },
  },
  Launch: {
    isBooked: async (launch, _, { dataSources }) => {
      return dataSources.userAPI.isBookedOnLaunch({ launchId: launch.id });
    },
  },
  User: {
    trips: async (_, __, { dataSources }) => {
      const launchIds = await dataSources.userAPI.getLaunchIdsByUser();

      if (!launchIds.length) {
        return [];
      }

      const launches = dataSources.launchAPI.getLaunchesByIds({ launchIds });

      return launches || [];
    },
  },
};

export default resolvers;
