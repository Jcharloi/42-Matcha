import React from "react";
import Axios from "axios";
import "./App.css";
import { connect } from "react-redux";
import { insertUserProfile } from "./redux/actions/actions";
import { store } from "./redux/store";
import { User, Pictures, UserTags } from "./models/models";
import Test from "./Test";

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

class App extends React.Component<Props> {
  render() {
    return (
      <div>
        <Test />
        <div>My birthday : {this.props.birthday}</div>
        <div>My presentation : {this.props.presentation}</div>
        <div>My city : {this.props.city}</div>
        <div>
          My tags :
          {this.props.tags.map(({ tag_id, name, custom }) => (
            <div key={tag_id}>{name}</div>
          ))}
        </div>
        My new presentation :
        <input
          onChange={({ target: { value } }) => {
            const newData = { ...this.props, presentation: value };
            store.dispatch(insertUserProfile(newData));
          }}
        />
        <br />
        <button
          onClick={() => {
            Axios.post("http://localhost:5000/get-user-profile")
              .then(({ data }) => {
                store.dispatch(insertUserProfile(data));
              })
              .catch(error => {
                console.log("Error", error.message);
              });
          }}
        >
          Get user infos
        </button>
      </div>
    );
  }
}

const mapStateToProps = (state: User): Props => {
  return state;
};

/*
const thunkAsyncAction = () => async (dispatch: Dispatch): Promise<void> => {
  // dispatch actions, return Promise, etc.
}
*/

export default connect(mapStateToProps)(App);
