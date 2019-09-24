import * as React from "react";
import { Route, Redirect } from "react-router";
import { FunctionComponent } from "react";

import IsCompleted from "./IsCompleted";

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
      ) : isAuth ? (
        <IsCompleted />
      ) : (
        <Redirect to="/" />
      )
    }
  />
);

export default CompletedRoutes;
