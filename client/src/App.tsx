import * as React from "react";
import { Router, Switch, Route } from "react-router-dom";
import history from "./helpers/history";
import { connect } from "react-redux";

import PrivateRoutes from "./components/PrivateRoutes";
import CompletedRoutes from "./components/CompletedRoutes";
import Authentification from "./views/Authentification";

import Home from "./views/Home";
import Profile from "./views/Profile";
import { VerifiedUser } from "./models/models";

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
            <Route
              exact={true}
              path="/"
              component={this.props.isAuth ? Profile : Authentification}
            />
            <PrivateRoutes
              exact={true}
              isAuth={this.props.isAuth}
              path="/profile"
              component={Profile}
            />
            <CompletedRoutes
              exact={true}
              isAuth={this.props.isAuth}
              isCompleted={this.props.isCompleted}
              path="/home"
              component={Home}
            />
          </Switch>
          {/* <Test />
        <div>My birthday : {this.props.birthday}</div>
        <div>My presentation : {this.props.presentation}</div>
        <div>My city : {this.props.city}</div>
        <div>
          My tags :
          {this.props.tags.map(({ tag_id, name, custom }) => (
            <div key={tag_id}>{name}</div>
          ))}
        </div>
        My new presentation :
        <input
          onChange={({ target: { value } }) => {
            const newData = { ...this.props, presentation: value };
            store.dispatch(insertUserProfile(newData));
          }}
        />
        <br />*/}
        </Router>
      </div>
    );
  }
}

const mapStateToProps = (state: VerifiedUser): Props => {
  return state;
};

/*
const thunkAsyncAction = () => async (dispatch: Dispatch): Promise<void> => {
  // dispatch actions, return Promise, etc.
}
*/

export default connect(mapStateToProps)(App);
