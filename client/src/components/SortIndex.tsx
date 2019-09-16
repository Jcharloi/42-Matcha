import * as React from "react";
import "rc-slider/assets/index.css";

interface Props {
  sortByIndex(index: string): any;
}

class sortIndex extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }
  public render() {
    return (
      <div>
        <button
          className="ui button"
          onClick={() => this.props.sortByIndex("Age")}
        >
          Age
        </button>
        <button
          className="ui button"
          onClick={() => this.props.sortByIndex("Localisation")}
        >
          Localisation
        </button>
        <button
          className="ui button"
          onClick={() => this.props.sortByIndex("Popularity")}
        >
          Popularity
        </button>
        <button
          className="ui button"
          onClick={() => this.props.sortByIndex("Tags")}
        >
          Tags
        </button>
      </div>
    );
  }
}

export default sortIndex;
