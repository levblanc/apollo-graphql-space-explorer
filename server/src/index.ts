import 'dotenv/config';

import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import typeDefs from './schema';
import UserAPI from './datasources/user';
import LaunchAPI from './datasources/launch';

const server = new ApolloServer({
  typeDefs,
});

const { url } = await startStandaloneServer(server, {
  context: async () => {
    const { cache } = server;
    return {
      dataSources: {
        userAPI: new UserAPI(),
        launchAPI: new LaunchAPI({ cache }),
      },
    };
  },
  listen: { port: 4000 },
});

console.log(`🚀  Server ready at: ${url}`);
