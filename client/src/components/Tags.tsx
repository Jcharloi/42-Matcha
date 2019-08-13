import * as React from "react";
import Axios from "axios";

import { Button, Icon, Header } from "semantic-ui-react";
import "../styles/stylesUserTags.css";

import { connect } from "react-redux";
import { State } from "../redux/types/types";
const uuidv1 = require("uuid/v1");

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
  pictures: any;
  tags: any;
}

interface TState {
  tags: { [key: string]: { name: string } };
  userTags: [{ tag_id: string; name: string; custom: boolean }];
  displayCustom: boolean;
  customTag: string;
  messageTags?: string | null;
}

class Tags extends React.Component<Props, TState> {
  constructor(props: Props) {
    super(props);
    this.state = {
      displayCustom: false,
      tags: {},
      userTags: this.props.tags,
      customTag: ""
    };
  }

  async componentDidMount() {
    await Axios.post("http://localhost:5000/profile/get-tags", {
      token: localStorage.getItem("token"),
      userName: localStorage.getItem("user_name")
    })
      .then(({ data: { validated, userInfos } }) => {
        if (validated) {
          this.setState({
            tags: userInfos.tagsList
          });
        }
      })
      .catch(error => console.error(error));
  }

  public render() {
    return (
      <div className="media-container">
        <div className="title-container-tag">
          <Header as="h3" dividing className="title">
            Some tags who represents me
          </Header>
        </div>
        <div className="tag-container">
          {this.state.userTags &&
            this.state.userTags.map(tag => (
              <div key={tag.tag_id} className="tag-value ui tag label large ">
                <span>{tag.name}</span>
                {/* <Icon
                    name="close"
                    onClick={async () => {
                      if (this.state.userTags.length > 1) {
                        await Axios.put(
                          "http://localhost:5000/profile/delete-tags",
                          {
                            tagName: name,
                            userName: localStorage.getItem("user_name"),
                            token: localStorage.getItem("token")
                          }
                        )
                          .then(({ data: { validated, message } }) => {
                            if (validated) {
                              const { userTags, tags } = this.state;
                              delete userTags[key];
                              if (!custom) {
                                tags[uuidv1()] = {
                                  name
                                };
                              }
                              this.setState({
                                tags,
                                userTags: this.state.userTags
                              });
                            }
                            this.setState({ messageTags: message });
                          })
                          .catch(error => console.error(error));
                      } else {
                        this.setState({
                          messageTags: "You can't delete your only tag"
                        });
                      }
                    }}
                  /> */}
              </div>
            ))}
          {/* <button className="circular ui icon blue button">
            <i
              className="icon plus"
              onClick={() => {
                this.setState({ displayCustom: true });
              }}
            />
          </button>
          {this.state.displayCustom && (
            <div className="custom-tag-container">
              <h1 className="title">Wanna add more ?</h1>
              {this.state.tags &&
                Object.entries(this.state.tags).map(([key, { name }]) => (
                  <span key={key} className="tag-value ui tag label">
                    <span
                      onClick={async () => {
                        await Axios.put(
                          "http://localhost:5000/profile/select-tags",
                          {
                            tagName: name,
                            userName: localStorage.getItem("user_name"),
                            token: localStorage.getItem("token")
                          }
                        )
                          .then(({ data: { validated, message } }) => {
                            if (validated) {
                              const { userTags, tags } = this.state;
                              delete tags[key];
                              userTags[uuidv1()] = {
                                name,
                                custom: false
                              };
                            }
                            this.setState({
                              messageTags: message
                            });
                          })
                          .catch(error => console.error(error));
                      }}
                    >
                      {name}
                    </span>
                  </span>
                ))}
              <div className="add-custom-tag">
                <div className="block">
                  <Icon name="paperclip" size="large" />
                  <input
                    className="input-value-tag"
                    placeholder="Custom tag"
                    onChange={({ target: { value } }) => {
                      this.setState({ customTag: value });
                    }}
                  />
                </div>
                <Button
                  className="ui primary button button-valid-edit-tag"
                  onClick={async () => {
                    if (
                      this.state.customTag &&
                      this.state.customTag.length <= 15
                    ) {
                      //pour la recherche, les tags dispos seront les utilisés par l'user et tout le reste
                      await Axios.post(
                        "http://localhost:5000/profile/add-custom-tags",
                        {
                          customTag: this.state.customTag,
                          userName: localStorage.getItem("user_name"),
                          token: localStorage.getItem("token")
                        }
                      )
                        .then(({ data: { validated, message } }) => {
                          if (validated) {
                            let userTags = {
                              ...this.state.userTags
                            };
                            userTags[uuidv1()] = {
                              name: this.state.customTag,
                              custom: true
                            };
                            this.setState({
                              userTags: userTags
                            });
                          }
                          this.setState({
                            messageTags: message
                          });
                        })
                        .catch(error => console.error(error));
                    } else {
                      this.setState({
                        messageTags:
                          "You need to provide a valid tag, under 15 characters"
                      });
                    }
                  }}
                >
                  Add my tag
                </Button>
                {this.state.messageTags && (
                  <div className="edit-text">{this.state.messageTags}</div>
                )}
              </div>
            </div>
          )} */}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: State): Props => {
  return state.user;
};

export default connect(mapStateToProps)(Tags);
