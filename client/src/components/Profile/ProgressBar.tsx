import * as React from "react";
import { User } from "../../models/models";
import { State } from "../../redux/types/types";
import { connect } from "react-redux";

import "../../styles/stylesUserProgressBar.css";

interface Props {
  isOther: boolean;
  user: User;
  other: User;
}

class ProgressBar extends React.Component<Props, {}> {
  public render() {
    return (
      <div className="bar-progress">
        <div
          className="ui indicating progress progressing p-o"
          data-percent={
            this.props.isOther === false
              ? this.props.user.score
              : this.props.other.score
          }
        >
          <div
            className="bar"
            style={{
              width: `${
                this.props.isOther === false
                  ? this.props.user.score
                  : this.props.other.score
              }%`
            }}
            color="violet"
          />
          <div className="label">
            Popularity score :{" "}
            {this.props.isOther === false
              ? this.props.user.score
              : this.props.other.score}
            %
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: State) => {
  return { user: state.user, other: state.otherUser };
};

export default connect(mapStateToProps)(ProgressBar);
