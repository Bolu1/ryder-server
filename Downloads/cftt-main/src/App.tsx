import React from "react";
import "./App.css";
import { privateRoutes, authRoutes, publicRoutes } from "routes/index";
import AppRoute from "routes/appRoutes";
import { Switch, Router, Route } from "react-router-dom";
import { history } from "helpers";
import AuthLayout from "Layouts/AuthLayout";
import DashboardLayout from "Layouts/DashboardLayout";
import LegalLayout from "Layouts/LegalLayout";
const App = (): JSX.Element => {
  return (
    <>
      <React.Fragment>
        <Router history={history}>
          <Switch>
            {privateRoutes.map((route, idx) => (
              <AppRoute
                path={route.path}
                layout={DashboardLayout}
                component={route.component}
                key={idx}
                permission={route?.permission}
                isAuthProtected={true}
                exact={true}
              />
            ))}

            {publicRoutes.map((route, idx) => (
              <AppRoute
                path={route.path}
                layout={LegalLayout}
                component={route.component}
                key={idx}
                isAuthProtected={false}
                exact={true}
              />
            ))}

            {authRoutes.map((route, idx) => (
              <AppRoute
                path={route.path}
                layout={AuthLayout}
                component={route.component}
                key={idx}
                isAuthProtected={false}
                exact={true}
              />
            ))}
          </Switch>
        </Router>
      </React.Fragment>
    </>
  );
};

export default App;
