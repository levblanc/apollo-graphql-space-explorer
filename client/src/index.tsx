import {
  ApolloClient,
  ApolloProvider,
  NormalizedCacheObject,
} from '@apollo/client';
import { cache } from './cache';
import ReactDOM from 'react-dom/client';
import Pages from './pages';
import injectStyles from './styles';

// Initialize ApolloClient
const client = new ApolloClient<NormalizedCacheObject>({
  cache,
  uri: 'http://localhost:4000/graphql',
});

injectStyles();

// Find our rootElement or throw and error if it doesn't exist
const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');
const root = ReactDOM.createRoot(rootElement);

// Pass the ApolloClient instance to the ApolloProvider component;
root.render(
  <ApolloProvider client={client}>
    <Pages />
  </ApolloProvider>
);
