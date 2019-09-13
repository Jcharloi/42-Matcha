import * as React from "react";
import Axios from "axios";
import { deleteUser, isProfileCompleted } from "../App";

import { connect } from "react-redux";
import { State } from "../redux/types/types";
import { store } from "../redux/store";
import { insertUserProfile, updateUserAuth } from "../redux/actions/actions";

import { Button, Icon, Header, Input } from "semantic-ui-react";
import "../styles/stylesUserTags.css";

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
  tagsList: [{ id: string; name: string }];
  displayCustom: boolean;
  customTag: string;
  messageTags?: string | null;
}

class Tags extends React.Component<Props, TState> {
  constructor(props: Props) {
    super(props);
    this.state = {
      displayCustom: false,
      tagsList: [{ id: "", name: "" }],
      customTag: ""
    };
  }

  async componentDidMount() {
    await Axios.post(`http://localhost:5000/profile/get-tags`, {
      userName: localStorage.getItem("user_name"),
      token: localStorage.getItem("token")
    })
      .then(({ data: { validToken, validated, userInfos } }) => {
        if (validToken === false) {
          deleteUser();
        } else {
          if (validated) {
            this.setState({
              tagsList: userInfos.tagsList
            });
          }
        }
      })
      .catch(error => console.error(error));
  }

  public render() {
    if (this.state.messageTags) {
      setTimeout(() => this.setState({ messageTags: "" }), 4000);
    }
    return (
      <div className="media-container">
        <div className="title-container-tag">
          <Header as="h3" dividing className="title">
            Some tags who represents me
          </Header>
        </div>
        <div className="tag-container">
          {this.props.tags &&
            this.props.tags.map((tag: any) => (
              <div key={tag.tag_id} className="tag-value ui tag label large ">
                <span>{tag.name}</span>
                <Icon
                  name="close"
                  onClick={async () => {
                    if (this.props.tags.length > 1) {
                      await Axios.put(
                        "http://localhost:5000/profile/delete-tags",
                        {
                          tagName: tag.name,
                          userName: localStorage.getItem("user_name"),
                          token: localStorage.getItem("token")
                        }
                      )
                        .then(
                          ({
                            data: { validToken, validated, tagId, message }
                          }) => {
                            if (validToken === false) {
                              deleteUser();
                            } else {
                              if (validated) {
                                const tagIndex = this.props.tags.findIndex(
                                  (tag: any) => {
                                    return tag.tag_id === tagId;
                                  }
                                );
                                this.props.tags.splice(tagIndex, 1);
                                if (!tag.custom) {
                                  this.state.tagsList.push({
                                    id: tagId,
                                    name: tag.name
                                  });
                                  this.setState({
                                    tagsList: this.state.tagsList
                                  });
                                }
                                const newData = {
                                  ...this.props,
                                  tags: this.props.tags
                                };
                                store.dispatch(insertUserProfile(newData));
                                this.setState({
                                  tagsList: this.state.tagsList
                                });
                              }
                              this.setState({ messageTags: message });
                            }
                          }
                        )
                        .catch(error => console.error(error));
                    } else {
                      this.setState({
                        messageTags: "You can't delete your only tag"
                      });
                    }
                  }}
                />
              </div>
            ))}
          <button className="circular ui icon blue button">
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
              {this.state.tagsList &&
                this.state.tagsList.map(({ id, name }, index) => (
                  <span key={id} className="tag-value ui tag label">
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
                          .then(
                            ({ data: { validToken, validated, message } }) => {
                              if (validToken === false) {
                                deleteUser();
                              } else {
                                if (validated) {
                                  const newData = {
                                    ...this.props,
                                    tags: [
                                      ...this.props.tags,
                                      {
                                        tag_id: id,
                                        name,
                                        custom: false
                                      }
                                    ]
                                  };
                                  const tags = this.state.tagsList;
                                  tags.splice(index, 1);
                                  this.setState({
                                    tagsList: tags
                                  });
                                  store.dispatch(insertUserProfile(newData));
                                  let isCompleted = isProfileCompleted(
                                    this.props.city,
                                    this.props.gender,
                                    this.props.presentation,
                                    this.props.pictures,
                                    this.props.tags
                                  );
                                  store.dispatch(
                                    updateUserAuth({
                                      isAuth: true,
                                      isCompleted
                                    })
                                  );
                                }
                                this.setState({
                                  messageTags: message
                                });
                              }
                            }
                          )
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
                  <Input
                    className="input-value-tag"
                    placeholder="Custom tag"
                    maxLength="15"
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
                        .then(
                          ({
                            data: { validToken, validated, message, randomId }
                          }) => {
                            if (validToken === false) {
                              deleteUser();
                            } else {
                              if (validated) {
                                const newData = {
                                  ...this.props,
                                  tags: [
                                    ...this.props.tags,
                                    {
                                      tag_id: randomId,
                                      name: this.state.customTag,
                                      custom: true
                                    }
                                  ]
                                };
                                store.dispatch(insertUserProfile(newData));
                                let isCompleted = isProfileCompleted(
                                  this.props.city,
                                  this.props.gender,
                                  this.props.presentation,
                                  this.props.pictures,
                                  this.props.tags
                                );
                                store.dispatch(
                                  updateUserAuth({
                                    isAuth: true,
                                    isCompleted
                                  })
                                );
                              }
                              this.setState({
                                messageTags: message
                              });
                            }
                          }
                        )
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
                  <div className="toast-message ui violet floating message">
                    <p>{this.state.messageTags}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: State): Props => {
  return state.user;
};

export default connect(mapStateToProps)(Tags);
