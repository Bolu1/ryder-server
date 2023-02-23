import React from "react";
import { render } from "react-dom";
import "./index.css";
import { Provider } from "react-redux";
import "react-day-picker/dist/style.css";
import "bootstrap/dist/css/bootstrap.min.css";
import App from "./App";
import { ApolloProvider } from "@apollo/client";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "store/configureStore";
import "react-calendar/dist/Calendar.css";
import "react-quill/dist/quill.snow.css";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css";
import { client } from "GraphQl/Client";
const rootElement = document.getElementById("root");
render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
    </PersistGate>
  </Provider>,
  rootElement
);
