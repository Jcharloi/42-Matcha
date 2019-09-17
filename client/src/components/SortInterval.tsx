import * as React from "react";
import Axios from "axios";
import { Range } from "rc-slider";
import { Tags } from "../models/models";

import { Button, Icon } from "semantic-ui-react";
import "rc-slider/assets/index.css";

interface Props {
  sortByInterval(
    index: string,
    start: number,
    end: number,
    tagsName: Array<string>
  ): void;
  clearMatch(): void;
}

interface State {
  startAge: number;
  endAge: number;
  startLoc: number;
  endLoc: number;
  startPop: number;
  endPop: number;
  tags: Array<Tags>;
  list: Array<string>;
  messageTags?: string;
}

class SortInterval extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      startAge: 50,
      endAge: 70,
      startLoc: 130,
      endLoc: 180,
      startPop: 40,
      endPop: 64,
      list: [],
      tags: []
    };
  }

  componentDidMount = async () => {
    Axios.put("http://localhost:5000/profile/get-all-tags", {
      userName: localStorage.getItem("user_name"),
      token: localStorage.getItem("token")
    })
      .then(({ data: { validated, message, tags } }) => {
        if (validated) {
          this.setState({ tags });
        }
        this.setState({ messageTags: message });
      })
      .catch(err => {
        console.error(err);
      });
  };

  tagsClick = (name: string) => {
    this.state.list.push(name);
    this.props.sortByInterval("Tags", 0, 0, this.state.list);
  };

  public render() {
    if (this.state.messageTags) {
      setTimeout(() => this.setState({ messageTags: "" }), 4000);
    }
    return (
      <div>
        <div className="container-range">
          Sort by age :
          <div>
            <span>{this.state.startAge}</span>
            <span>{this.state.endAge}</span>
          </div>
          <div className="range">
            <span>18</span>
            <Range
              min={18}
              max={100}
              defaultValue={[50, 70]}
              onChange={value => {
                this.setState({ startAge: value[0], endAge: value[1] });
                this.props.sortByInterval("Age", value[0], value[1], []);
              }}
            />
            <span>100 yo</span>
          </div>
          Sort by location :
          <div>
            <span>{this.state.startLoc}</span>
            <span>{this.state.endLoc}</span>
          </div>
          <div className="range">
            <span>0</span>
            <Range
              min={0}
              max={300}
              defaultValue={[130, 180]}
              onChange={value => {
                this.setState({ startLoc: value[0], endLoc: value[1] });
                this.props.sortByInterval(
                  "Localisation",
                  value[0],
                  value[1],
                  []
                );
              }}
            />
            <span>300 km</span>
          </div>
          Sort by popularity :
          <div>
            <span>{this.state.startPop}</span>
            <span>{this.state.endPop}</span>
          </div>
          <div className="range">
            <span>0</span>
            <Range
              min={0}
              max={100}
              defaultValue={[40, 64]}
              onChange={value => {
                this.setState({ startPop: value[0], endPop: value[1] });
                this.props.sortByInterval("Popularity", value[0], value[1], []);
              }}
            />
            <span>100%</span>
          </div>
          <div>
            {this.state.tags.map(({ id, name }) => (
              <Button key={id} onClick={() => this.tagsClick(name)}>
                {name}
              </Button>
            ))}
          </div>
          <br />
          <Button
            onClick={() => {
              this.setState({
                list: []
              });
              this.props.clearMatch();
            }}
          >
            Clear tags
            <Icon name="close" />
          </Button>
          {this.state.messageTags && (
            <div className="toast-message ui blue floating message">
              {this.state.messageTags}
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default SortInterval;
