import * as React from "react";
import { State } from "../../redux/types/types";
import { UserMatchInfos } from "../../models/models";
import { connect } from "react-redux";
import TopMenu from "../TopMenu";

class OtherProfile extends React.Component<UserMatchInfos> {
  public render() {
    return (
      <div>
        <TopMenu current="profile" />
      </div>
    );
  }
}

const mapStateToProps = (state: State): UserMatchInfos => {
  return state.otherUser;
};

export default connect(mapStateToProps)(OtherProfile);
