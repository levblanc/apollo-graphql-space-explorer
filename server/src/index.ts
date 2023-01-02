import 'dotenv/config';

import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import isEmail from 'isemail';
import UserAPI from './datasources/user';
import LaunchAPI from './datasources/launch';
import typeDefs from './schema';
import resolvers from './resolvers';
import { createStore } from './utils';

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const store = createStore();

const { url } = await startStandaloneServer(server, {
  context: async ({ req }) => {
    const { cache } = server;
    const dataSources = {
      userAPI: new UserAPI({ store }),
      launchAPI: new LaunchAPI({ cache }),
    };

    const auth = (req.headers && req.headers.authorization) || '';
    const email = Buffer.from(auth, 'base64').toString('ascii');

    if (!isEmail.validate(email)) {
      return { user: null, dataSources };
    }

    const users = await store.users.findOrCreate({
      where: { email },
    });
    const user = (users && users[0]) || null;

    return { user: { ...user.dataValues }, dataSources };
  },
  listen: { port: 4000 },
});

console.log(`🚀  Server ready at: ${url}`);
