import * as React from "react";
import Axios from "axios";
import { Range } from "rc-slider";
import { Tags } from "../models/models";

import "rc-slider/assets/index.css";
import "../styles/stylesUserHome.css";
import { Icon } from "semantic-ui-react";

interface Props {
  isSearch: boolean;
  startAge: number;
  endAge: number;
  startLoc: number;
  endLoc: number;
  startPop: number;
  endPop: number;
  preference: string;
  tagsName: Array<string>;
  byInterval(
    startAge: number,
    endAge: number,
    startLoc: number,
    endLoc: number,
    startPop: number,
    endPop: number,
    tagsName: Array<string>,
    preference?: string
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
  preference: string;
  messageTags?: string;
}

class FilterInterval extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      startAge: this.props.startAge,
      endAge: this.props.endAge,
      startLoc: this.props.startLoc,
      endLoc: this.props.endLoc,
      startPop: this.props.startPop,
      endPop: this.props.endPop,
      preference: this.props.preference,
      list: this.props.tagsName,
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
    if (this.state.list.indexOf(name) === -1) {
      this.state.list.push(name);
    } else {
      this.state.list.splice(this.state.list.indexOf(name), 1);
    }
    this.props.byInterval(
      this.state.startAge,
      this.state.endAge,
      this.state.startLoc,
      this.state.endLoc,
      this.state.startPop,
      this.state.endPop,
      this.state.list.length > 0 ? this.state.list : [],
      this.state.preference
    );
  };

  handleSelectChange = async (value: string) => {
    await this.setState({
      preference: value
    });
    this.props.byInterval(
      this.state.startAge,
      this.state.endAge,
      this.state.startLoc,
      this.state.endLoc,
      this.state.startPop,
      this.state.endPop,
      this.state.list,
      this.state.preference
    );
  };

  public render() {
    if (this.state.messageTags) {
      setTimeout(() => this.setState({ messageTags: "" }), 4000);
    }
    return (
      <div>
        <div className="container-range">
          {this.props.isSearch ? (
            <div>
              <span className="text-preference-search">
                Filter by orientation :
              </span>
              <select
                value={this.state.preference}
                onChange={({ target: { value } }) => {
                  this.handleSelectChange(value);
                }}
              >
                <option value="Man">Man</option>
                <option value="Woman">Woman</option>
                <option value="Other">Other</option>
                <option value="Both">Both</option>
              </select>
            </div>
          ) : null}
          <h3>Filter by age :</h3>
          <div>
            <span>{this.state.startAge}</span>-<span>{this.state.endAge}</span>
          </div>
          <div className="range">
            <span>
              <h5 className="left-filter-number">18</h5>
            </span>
            <Range
              min={18}
              max={100}
              defaultValue={[this.state.startAge, this.state.endAge]}
              onChange={value => {
                this.setState({ startAge: value[0], endAge: value[1] });
                this.props.byInterval(
                  value[0],
                  value[1],
                  this.state.startLoc,
                  this.state.endLoc,
                  this.state.startPop,
                  this.state.endPop,
                  this.state.list,
                  this.state.preference
                );
              }}
            />
            <span>
              <h5>100&nbsp;yo</h5>
            </span>
          </div>
          <h3>Filter by location :</h3>
          <div>
            <span>{this.state.startLoc}</span>-<span>{this.state.endLoc}</span>
          </div>
          <div className="range">
            <span>
              <h5 className="left-filter-number">0</h5>
            </span>
            <Range
              min={0}
              max={1000}
              defaultValue={[this.state.startLoc, this.state.endLoc]}
              onChange={value => {
                this.setState({ startLoc: value[0], endLoc: value[1] });
                this.props.byInterval(
                  this.state.startAge,
                  this.state.endAge,
                  value[0],
                  value[1],
                  this.state.startPop,
                  this.state.endPop,
                  this.state.list,
                  this.state.preference
                );
              }}
            />
            <span>
              <h5>1 000 km</h5>
            </span>
          </div>
          <h3>Filter by popularity :</h3>
          <div>
            <span>{this.state.startPop}</span>-<span>{this.state.endPop}</span>
          </div>
          <div className="range">
            <span>
              <h5 className="left-filter-number">0</h5>
            </span>
            <Range
              min={0}
              max={100}
              defaultValue={[this.state.startPop, this.state.endPop]}
              onChange={value => {
                this.setState({ startPop: value[0], endPop: value[1] });
                this.props.byInterval(
                  this.state.startAge,
                  this.state.endAge,
                  this.state.startLoc,
                  this.state.endLoc,
                  value[0],
                  value[1],
                  this.state.list,
                  this.state.preference
                );
              }}
            />
            <span>
              <h5>100&nbsp;%</h5>
            </span>
          </div>
          <h3>Filter by tags :</h3>
          <div className="tagList">
            {this.state.tags.map(({ id, name }) => (
              <button
                key={id}
                onClick={() => this.tagsClick(name)}
                className={
                  this.state.list.indexOf(name) > -1
                    ? "ui tag grey label active"
                    : "ui tag label"
                }
              >
                {name}
              </button>
            ))}
          </div>
          <br />
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

export default FilterInterval;
