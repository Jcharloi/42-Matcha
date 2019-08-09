import * as React from "react";
import TopMenu from "../components/TopMenu";

class Profile extends React.Component {
  public render() {
    return (
      <div>
        <TopMenu current="profile" />
        Je suis sur la page profile
        {/*
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
        <br />*/}
      </div>
    );
  }
}

export default Profile;
