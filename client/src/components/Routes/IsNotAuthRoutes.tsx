import * as React from "react";
import { Redirect, Route } from "react-router";
import { FunctionComponent } from "react";

interface Props {
  exact: boolean;
  component: any;
  isAuth: boolean;
  path: string;
}

export const IsNotAuthRoutes: FunctionComponent<Props> = ({
  component: Component,
  isAuth,
  ...rest
}) => (
  <Route
    {...rest}
    render={props =>
      isAuth ? (
        <div>
          <Redirect to="/profile" />
        </div>
      ) : (
        <Component {...props} />
      )
    }
  />
);

export default IsNotAuthRoutes;
