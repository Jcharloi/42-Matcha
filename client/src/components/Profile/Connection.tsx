import * as React from "react";
import { findLastSince } from "../../App";

import "../../styles/stylesUserConnection.css";

interface Props {
  connection: string;
}

class Connection extends React.Component<Props, {}> {
  public render() {
    return (
      <div className="connection-container">
        <div
          className={
            findLastSince(this.props.connection).split(" ")[1] === "seconds"
              ? "ring-profile ring-color-online"
              : "ring-profile ring-color-offline"
          }
        />
        <div className="text">
          {findLastSince(this.props.connection).split(" ")[1] === "seconds"
            ? `Online now`
            : `Last seen ${findLastSince(this.props.connection)}`}
        </div>
      </div>
    );
  }
}

export default Connection;
