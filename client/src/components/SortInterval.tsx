import * as React from "react";
import { Range } from "rc-slider";

import "rc-slider/assets/index.css";

interface Props {
  sortByInterval(index: string, start: number, end: number): any;
}

class SortInterval extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }
  public render() {
    return (
      <div>
        <div className="container-range">
          Sort by age :
          <div className="range">
            <span>18</span>
            <Range
              min={18}
              max={100}
              defaultValue={[25, 40]}
              onChange={value => {
                this.props.sortByInterval("Age", value[0], value[1]);
              }}
            />
            <span>100 yo</span>
          </div>
          Sort by localisation :
          <div className="range">
            <span>0</span>
            <Range
              min={0}
              max={300}
              defaultValue={[25, 40]}
              onChange={value => {
                this.props.sortByInterval("Localisation", value[0], value[1]);
              }}
            />
            <span>300 km</span>
          </div>
          Sort by popularity :
          <div className="range">
            <span>0</span>
            <Range
              min={0}
              max={100}
              defaultValue={[25, 40]}
              onChange={value => {
                this.props.sortByInterval("Popularity", value[0], value[1]);
              }}
            />
            <span>100%</span>
          </div>
        </div>
      </div>
    );
  }
}

export default SortInterval;
