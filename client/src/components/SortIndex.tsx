import * as React from "react";

import { Button, Icon } from "semantic-ui-react";
import "rc-slider/assets/index.css";

interface Props {
  sortByIndex(index: string): any;
}

class SortIndex extends React.Component<Props> {
  public render() {
    return (
      <div>
        <div className="menu">
          <Button
            className="basic blue item button-sort"
            onClick={() => this.props.sortByIndex("Age")}
          >
            <Icon name="birthday" />
            Age
          </Button>
          <Button
            className="basic violet item button-sort"
            onClick={() => this.props.sortByIndex("Localisation")}
          >
            <Icon name="map signs" />
            Localisation
          </Button>
          <Button
            className="basic purple item button-sort"
            onClick={() => this.props.sortByIndex("Popularity")}
          >
            <Icon name="hand point up" />
            Popularity
          </Button>
          <Button
            className="basic pink item button-sort"
            onClick={() => this.props.sortByIndex("Tags")}
          >
            <Icon name="hashtag" />
            Tags
          </Button>
        </div>
      </div>
    );
  }
}

export default SortIndex;
