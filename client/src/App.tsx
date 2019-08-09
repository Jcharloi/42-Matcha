import * as React from "react";
import { Router, Switch } from "react-router-dom";
import history from "./helpers/history";
import { connect } from "react-redux";
import { State } from "./redux/types/types";

import PublicRoutes from "./components/PublicRoutes";
import PrivateRoutes from "./components/PrivateRoutes";
import CompletedRoutes from "./components/CompletedRoutes";

import Authentication from "./views/Authentification";
import Profile from "./views/Profile";
import Home from "./views/Home";

interface Props {
  isAuth: boolean;
  isCompleted: boolean;
}

class App extends React.Component<Props> {
  render() {
    return (
      <div>
        <Router history={history}>
          <Switch>
            <PublicRoutes
              exact={true}
              path="/"
              component={Authentication}
              isAuth={this.props.isAuth}
            />
            <PrivateRoutes
              exact={true}
              path="/profile"
              component={Profile}
              isAuth={this.props.isAuth}
            />
            <CompletedRoutes
              exact={true}
              path="/home"
              component={Home}
              isAuth={this.props.isAuth}
              isCompleted={this.props.isCompleted}
            />
          </Switch>
        </Router>
      </div>
    );
  }
}

const mapStateToProps = (state: State): Props => {
  return {
    isAuth: state.verified.isAuth,
    isCompleted: state.verified.isCompleted
  };
};

/*
const thunkAsyncAction = () => async (dispatch: Dispatch): Promise<void> => {
  // dispatch actions, return Promise, etc.
}
*/

export default connect(mapStateToProps)(App);
