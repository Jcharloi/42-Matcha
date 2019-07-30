import React from "react";
import "./App.css";
import { connect } from "react-redux";
import {
  decrementAction,
  incrementAction,
  changeString
} from "./redux/actions/actions";
import { store } from "./redux/store";

interface Props {
  testNumber: number;
  testString: string;
}

class App extends React.Component<Props> {
  render() {
    return (
      <div>
        <div>My string : {this.props.testString}</div>
        <input
          onChange={({ target: { value } }) => {
            const action = changeString(value);
            store.dispatch(action);
          }}
        />
        <div>My number : {this.props.testNumber}</div>
        <button
          onClick={() => {
            const action = incrementAction();
            store.dispatch(action);
          }}
        >
          +
        </button>
        <button
          onClick={() => {
            const action = decrementAction();
            store.dispatch(action);
          }}
        >
          -
        </button>
      </div>
    );
  }
}

//typer quand y a plusieurs xxxState
const mapStateToProps = (state: any): Props => {
  return {
    testNumber: state.counterReducer.testNumber,
    testString: state.stringReducer.testString
  };
};

export default connect(mapStateToProps)(App);
