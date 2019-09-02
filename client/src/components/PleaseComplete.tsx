import * as React from "react";
import TopMenu from "../components/TopMenu";
import Profile from "../views/Profile";
import { Redirect } from 'react-router-dom';
import "../styles/stylesRedirect.css";

class PleaseComplete extends React.Component {
  state = {
    redirect: false
  }
  setRedirect = () => {
    this.setState({
      redirect: true
    })
  }
  renderRedirect = () => {
    if (this.state.redirect) {
      return <Redirect to='/profile' />
    }
  }
 
  render () {
    return (
       <div className="main-container">
        {this.renderRedirect()}
        <TopMenu current="home" />
        <h1>You did not completed your profile :(</h1>
        <h2>We need you to complete your profile so we can match you with others !</h2>
        
        <button className="ui button" onClick={this.setRedirect}>Complete my profile</button>
       </div>
    )
  }
}

export default PleaseComplete;
