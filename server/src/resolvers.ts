const resolvers = {
  Query: {
    launches: (_, __, { dataSources }) => {
      return dataSources.launchAPI.getAllLaunches();
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
