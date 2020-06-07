import React from "react";
import { Redirect, Route, Switch } from "react-router";
import Authorize from "./containers/Authorize/Authorize";
import Direction from "./containers/Direction/Direction";
import Apartments from "./containers/Apartments/Apartments";
import Info from "./containers/Info/Info";

const ProtectedRoute = (props) => {
  return props.isAllowed ? <Route {...props} /> : <Redirect to="/authorize" />;
  // return props ? <Route {...props} /> : <Redirect to="/" />;
};

const Routes = ({ user }) => {
  return (
    <Switch>
      <ProtectedRoute path="/" exact component={Apartments} isAllowed={user} />
      <Route path="/info/*" component={Info} />
      <Route path="/authorize" component={Authorize} />
      <Route path="/direction" component={Direction} />
    </Switch>
  );
};

export default Routes;
