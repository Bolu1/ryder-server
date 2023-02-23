import { ApolloClient, ApolloLink, HttpLink, InMemoryCache } from "@apollo/client";
import Cookies from 'js-cookie';
import { createUploadLink } from 'apollo-upload-client';

const httpLink = new HttpLink({
  uri: "https://admin.cftchurchesdevenvironment.xyz/graphql/",
});

const uploadLink = createUploadLink({ uri: "https://admin.cftchurchesdevenvironment.xyz/graphql/" });

const authLink = new ApolloLink((operation, forward) => {
  // Retrieve the authorization token from cookies.
  const token = Cookies.get('access-token');
  // Use the setContext method to set the HTTP headers.
  operation.setContext({
    headers: {
      authorization: token ? token : '',
      "keep-alive": "true"
    }
  });
  // Call the next link in the middleware chain.
  return forward(operation);
});


export const client = new ApolloClient({

    cache: new InMemoryCache(),
     //@ts-ignore
    link: authLink.concat(uploadLink),
  
});
