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
    me: (_, __, { user, dataSources }) => {
      return dataSources.userAPI.findOrCreateUser({ user });
    },
  },
  Mutation: {
    login: async (_, { email }, { dataSources }) => {
      const user = await dataSources.userAPI.findOrCreateUser({ email });

      if (user) {
        user.token = Buffer.from(email).toString('base64');
        return user;
      }
    },
    bookTrips: async (_, { launchIds }, { user, dataSources }) => {
      try {
        const results = await dataSources.userAPI.bookTrips({
          user,
          launchIds,
        });
        const launches = await dataSources.launchAPI.getLaunchesByIds({
          launchIds,
        });

        if (results && results.length === launchIds.length) {
          return {
            code: 200,
            success: true,
            message: 'Trips booked successfully',
            launches,
          };
        } else {
          const failedLaunches = launchIds.filter(
            (id) => !results.includes(id)
          );

          return {
            code: 400,
            success: false,
            message: `The following launches couldn't be booked: ${failedLaunches}`,
            launches,
          };
        }
      } catch (error) {
        return {
          code: 400,
          success: false,
          message: error,
          launches: [],
        };
      }
    },
    cancelTrip: async (_, { launchId }, { user, dataSources }) => {
      try {
        const result = await dataSources.userAPI.cancelTrip({ user, launchId });

        if (!result) {
          return {
            code: 400,
            success: false,
            message: 'Failed to cancel trip',
          };
        }

        const launch = await dataSources.launchAPI.getLaunchById({ launchId });
        return {
          code: 200,
          success: true,
          message: 'Trip canceled',
          launches: [launch],
        };
      } catch (error) {
        return {
          code: 400,
          success: false,
          message: error,
          launches: [],
        };
      }
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
