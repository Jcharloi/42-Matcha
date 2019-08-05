import * as React from "react";
import { Redirect, Route } from "react-router";
import { FunctionComponent } from "react";

interface Props {
  exact: boolean;
  component: any;
  isAuth: boolean;
  path: string;
}

export const PrivateRoutes: FunctionComponent<Props> = ({
  component: Component,
  isAuth,
  ...rest
}) => (
  <Route
    {...rest}
    render={props =>
      isAuth ? (
        <div>
          <Component {...props} />
        </div>
      ) : (
        <Redirect to="/" />
      )
    }
  />
);

export default PrivateRoutes;
