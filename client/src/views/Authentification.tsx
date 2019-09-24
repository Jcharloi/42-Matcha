import * as React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { Divider, Icon, Button } from "semantic-ui-react";

import "../styles/stylesAuth.css";
import SignUp from "../components/Auth/SignUp";
import SignIn from "../components/Auth/SignIn";
import ResetPassword from "../components/Auth/ResetPassword";

class Authentication extends React.Component {
  public render() {
    return (
      <div className="auth-container">
        <div className="auth-leftContainer">
          <span className="auth-title">Welcome, Matcher</span>
          <div className="auth-presentation">
            We are a great community with simple rules here :
          </div>
          <div className="auth-explication-little">
            <div>
              <Icon name="filter" color="purple" size="large" />
              <span className="text-little">You decide</span>
            </div>
            <div>
              <Icon name="mail" color="orange" size="large" />
              <span className="text-little">You match</span>
            </div>
            <div>
              <Icon name="heart" color="red" size="large" />
              <span className="text-little">You meet</span>
            </div>
          </div>
          <div className="auth-explication">
            <div className="auth-explication-step">
              <div className="auth-step">
                You decide, who you wanna see and who you wanna like
              </div>
              <Icon
                className="auth-icon"
                name="filter"
                color="purple"
                size="large"
              />
            </div>
            <div className="auth-divider">
              <Divider className="divider-icon" />
            </div>
            <div className="auth-explication-step">
              <span className="auth-icon">
                <Icon name="mail" color="orange" size="large" />
              </span>
              <div className="auth-step">
                You match them, it means that they are also interested by you
                &nbsp;
                <span role="img" aria-label="wink" className="icon">
                  😉
                </span>
              </div>
            </div>
            <div className="auth-divider">
              <Divider className="divider-icon" />
            </div>
            <div className="auth-explication-step">
              <div className="auth-step">
                You meet them, finally and get to know each other in real life,
                that's the main thing !
              </div>
              <Icon
                className="auth-icon"
                name="heart"
                color="red"
                size="large"
              />
            </div>
          </div>
        </div>
        <div className="auth-rightContainer">
          <Router>
            <Route path="/sign-in" component={SignIn} />
            <Route path="/sign-up" component={SignUp} />
            <Route path="/reset-password" component={ResetPassword} />
            <Route
              exact
              path="/"
              component={() => (
                <div className="auth-welcomeBox-buttonsContainer">
                  <Link to="/sign-up">
                    <Button fluid className="ui black button" size="massive">
                      Sign Up
                    </Button>
                  </Link>
                  <Link to="/sign-in">
                    <Button
                      fluid
                      className="ui black basic button"
                      size="massive"
                    >
                      Sign In
                    </Button>
                  </Link>
                </div>
              )}
            />
          </Router>
        </div>
      </div>
    );
  }
}

export default Authentication;
