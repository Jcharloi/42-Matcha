import React from "react";
import { Pictures, UserTags, User } from "./models/models";
import { connect } from "react-redux";

interface Props {
  user_id: string;
  mail: string;
  user_name: string;
  last_name: string;
  first_name: string;
  birthday: string;
  gender: string;
  orientation: string;
  presentation: string;
  score: string;
  city: string;
  pictures: Pictures[];
  tags: UserTags[];
}

class Test extends React.Component<Props> {
  render() {
    return <div>{this.props.presentation}</div>;
  }
}

const mapStateToProps = (state: User): Props => {
  return state;
};

export default connect(mapStateToProps)(Test);
