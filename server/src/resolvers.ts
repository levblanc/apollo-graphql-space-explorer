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
};

export default resolvers;
