import * as React from "react";

import "rc-slider/assets/index.css";

interface Props {
  sortByIndex(index: string): any;
}

class SortIndex extends React.Component<Props> {
  public render() {
    return (
      <div>
        <div className="ui compact menu">
          <div className="ui simple dropdown item sortBy">
            Sort by
            <i className="dropdown icon"></i>
            <div className="menu">
              <div
                className="item"
                onClick={() => this.props.sortByIndex("Age")}
              >
                Age
              </div>
              <div
                className="item"
                onClick={() => this.props.sortByIndex("Localisation")}
              >
                Localisation
              </div>
              <div
                className="item"
                onClick={() => this.props.sortByIndex("Popularity")}
              >
                Popularity
              </div>
              <div
                className="item"
                onClick={() => this.props.sortByIndex("Tags")}
              >
                Tags
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default SortIndex;
