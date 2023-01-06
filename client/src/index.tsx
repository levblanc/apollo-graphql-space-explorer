import {
  ApolloClient,
  ApolloProvider,
  gql,
  NormalizedCacheObject,
  useQuery,
} from '@apollo/client';
import { cache } from './cache';
import ReactDOM from 'react-dom/client';
import Pages from './pages';
import injectStyles from './styles';
import { TOKEN } from './constants';
import Login from './pages/login';

export const typeDefs = gql`
  extend type Query {
    isLoggedIn: Boolean!
    cartItems: [ID!]!
  }
`;

// Initialize ApolloClient
const client = new ApolloClient<NormalizedCacheObject>({
  cache,
  uri: 'http://localhost:4000/graphql',
  headers: {
    authorization: localStorage.getItem(TOKEN) || '',
  },
  typeDefs,
});

const IS_LOGGED_IN = gql`
  query IsUserLoggedIn {
    isLoggedIn @client
  }
`;

injectStyles();

// Find our rootElement or throw and error if it doesn't exist
const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');
const root = ReactDOM.createRoot(rootElement);

const IsLoggedIn = () => {
  const { data } = useQuery(IS_LOGGED_IN);

  return data.isLoggedIn ? <Pages /> : <Login />;
};

// Pass the ApolloClient instance to the ApolloProvider component;
root.render(
  <ApolloProvider client={client}>
    <IsLoggedIn />
  </ApolloProvider>
);
