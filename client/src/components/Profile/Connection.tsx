import * as React from "react";
import { findLastSince } from "../../App";
import { State } from "../../redux/types/types";
import { connect } from "react-redux";
import { User } from "../../models/models";

import "../../styles/stylesUserConnection.css";

interface Props {
  connection: string;
  user: User;
  otherUser: User;
}

class Connection extends React.Component<Props, {}> {
  public render() {
    return (
      <div className="connection-container">
        <div
          className={
            this.props.otherUser.user_id
              ? findLastSince(this.props.connection).split(" ")[1] === "seconds"
                ? "ring-profile ring-color-online"
                : "ring-profile ring-color-offline"
              : "ring-profile ring-color-online"
          }
        />
        <div className="text">
          {this.props.otherUser.user_id
            ? findLastSince(this.props.connection).split(" ")[1] === "seconds"
              ? `Online now`
              : `Last seen ${findLastSince(this.props.connection)}`
            : null}
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state: State) => {
  return { user: state.user, otherUser: state.otherUser };
};

export default connect(mapStateToProps)(Connection);
