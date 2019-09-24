import { Redirect, Route } from "react-router";
import { FunctionComponent } from "react";
import * as React from "react";

interface Props {
  exact?: boolean;
  component: any;
  isAuth: boolean;
  path: string;
}

export const PublicRoutes: FunctionComponent<Props> = ({
  component: Component,
  isAuth,
  ...rest
}) => (
  <Route
    {...rest}
    render={props =>
      !isAuth ? (
        <div>
          <Component {...props} />
        </div>
      ) : (
        <Redirect to="/profile" />
      )
    }
  />
);

export default PublicRoutes;
