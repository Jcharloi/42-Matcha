import * as React from "react";
import "../../styles/stylesUserConnection.css";

class Connection extends React.Component<{}, {}> {
  public render() {
    return (
      <div className="connection-container">
        <div className="ring" />
        <div className="text">Online now !</div>
      </div>
    );
  }
}

export default Connection;
