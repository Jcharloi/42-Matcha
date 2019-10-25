import * as React from "react";
import { findLastSince } from "../../App";

import "../../styles/stylesUserConnection.css";
import { connect } from "react-redux";
import { store } from "../../redux/store";
import { State } from "../../redux/types/types";
import { User } from "../../models/models";

interface Props {
  connection: string;
  user: User;
  otherUser: User;
}

class Connection extends React.Component<Props, {}> {
  public render() {
    if (!this.props.otherUser.user_id) console.log("TTTTTTTTT");
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
              : `Last fffseen ${findLastSince(this.props.connection)}`
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
