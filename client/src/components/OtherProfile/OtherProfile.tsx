import * as React from "react";
import { State } from "../../redux/types/types";
import { User } from "../../models/models";
import { connect } from "react-redux";
import TopMenu from "../TopMenu";

class OtherProfile extends React.Component<User> {
  public render() {
    return (
      <div>
        <TopMenu current="profile" />
        <div>{this.props.user_name}</div>
      </div>
    );
  }
}

const mapStateToProps = (state: State): User => {
  return state.otherUser;
};

export default connect(mapStateToProps)(OtherProfile);
