import { Redirect, Route } from "react-router";
import { FunctionComponent } from "react";
import * as React from "react";

interface Props {
  exact: boolean;
  component: any;
  isAuth: boolean;
  isCompleted?: boolean;
  path: string;
}

export const CompletedRoutes: FunctionComponent<Props> = ({
  component: Component,
  isAuth,
  isCompleted,
  ...rest
}) => (
  <Route
    {...rest}
    render={props =>
      isAuth && isCompleted ? (
        <div>
          <Component {...props} />
        </div>
      ) : (
        <Redirect to="/profile" />
      )
    }
  />
);

export default CompletedRoutes;
