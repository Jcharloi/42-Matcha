import * as React from "react";
import Axios from "axios";
import { deleteUser, isProfileCompleted } from "../../App";

import { store } from "../../redux/store";
import { insertUserProfile, updateUserAuth } from "../../redux/actions/actions";
import { User, UserTags } from "../../models/models";

import { Button, Icon, Header, Input } from "semantic-ui-react";
import "../../styles/stylesUserTags.css";

interface Props {
  isOther: boolean;
  user: User;
}

interface TState {
  tagsUser: Array<UserTags>;
  tagsList: Array<{
    id: string;
    name: string;
  }>;
  displayCustom: boolean;
  customTag: string;
  messageTags?: string | null;
}

class Tags extends React.Component<Props, TState> {
  constructor(props: Props) {
    super(props);
    this.state = {
      tagsUser: this.props.user.tags,
      displayCustom: false,
      tagsList: [],
      customTag: ""
    };
  }
  timer!: any;

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

  deleteTags = async (name: string, custom: boolean) => {
    if (this.state.tagsUser.length > 1) {
      await Axios.put("http://localhost:5000/profile/delete-tags", {
        tagName: name,
        userName: localStorage.getItem("user_name"),
        token: localStorage.getItem("token")
      })
        .then(({ data: { validToken, validated, tagId, message } }) => {
          if (validToken === false) {
            deleteUser();
          } else {
            if (validated) {
              const tagIndex = this.state.tagsUser.findIndex((tag: any) => {
                return tag.tag_id === tagId;
              });
              this.state.tagsUser.splice(tagIndex, 1);
              if (!custom) {
                this.state.tagsList.push({
                  id: tagId,
                  name
                });
                this.setState({
                  tagsList: this.state.tagsList
                });
              }
              const newData = {
                ...this.props.user,
                tags: this.state.tagsUser
              };
              store.dispatch(insertUserProfile(newData));
              this.setState({
                tagsList: this.state.tagsList,
                tagsUser: newData.tags
              });
            }
            if (this.timer) {
              clearTimeout(this.timer);
              this.timer = null;
            }
            this.setState({ messageTags: message });
          }
        })
        .catch(error => console.error(error));
    } else {
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      this.setState({
        messageTags: "You can't delete your only tag"
      });
    }
  };

  setDisplayCustom = () => {
    this.setState({ displayCustom: true });
  };

  selectTags = async (name: string, id: string, index: number) => {
    await Axios.put("http://localhost:5000/profile/select-tags", {
      tagName: name,
      userName: localStorage.getItem("user_name"),
      token: localStorage.getItem("token")
    })
      .then(({ data: { validToken, validated, message } }) => {
        if (validToken === false) {
          deleteUser();
        } else {
          if (validated) {
            const newData = {
              ...this.props.user,
              tags: [
                ...this.state.tagsUser,
                {
                  tag_id: id,
                  name,
                  custom: false
                }
              ]
            };
            store.dispatch(insertUserProfile(newData));
            const tags = this.state.tagsList;
            tags.splice(index, 1);
            this.setState({
              tagsList: tags,
              tagsUser: newData.tags
            });
            let isCompleted = isProfileCompleted(
              this.props.user.city,
              this.props.user.gender,
              this.props.user.presentation,
              this.props.user.pictures,
              this.state.tagsUser
            );
            store.dispatch(
              updateUserAuth({
                isAuth: true,
                isCompleted
              })
            );
          }
          if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
          }
          this.setState({
            messageTags: message
          });
        }
      })
      .catch(error => console.error(error));
  };

  setCustomTag = (customTag: string) => {
    this.setState({ customTag });
  };

  addTags = async () => {
    if (this.state.customTag && this.state.customTag.length <= 15) {
      await Axios.post("http://localhost:5000/profile/add-custom-tags", {
        customTag: this.state.customTag,
        userName: localStorage.getItem("user_name"),
        token: localStorage.getItem("token")
      })
        .then(({ data: { validToken, validated, message, randomId } }) => {
          if (validToken === false) {
            deleteUser();
          } else {
            if (validated) {
              const newData = {
                ...this.props.user,
                tags: [
                  ...this.state.tagsUser,
                  {
                    tag_id: randomId,
                    name: this.state.customTag,
                    custom: true
                  }
                ]
              };
              store.dispatch(insertUserProfile(newData));
              let isCompleted = isProfileCompleted(
                this.props.user.city,
                this.props.user.gender,
                this.props.user.presentation,
                this.props.user.pictures,
                this.state.tagsUser
              );
              store.dispatch(
                updateUserAuth({
                  isAuth: true,
                  isCompleted
                })
              );
              this.setState({ tagsUser: newData.tags });
            }
            if (this.timer) {
              clearTimeout(this.timer);
              this.timer = null;
            }
            this.setState({
              messageTags: message
            });
          }
        })
        .catch(error => console.error(error));
    } else {
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      this.setState({
        messageTags: "You need to provide a valid tag, under 15 characters"
      });
    }
  };

  createRandomId = (length: number) => {
    let result = "";
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };

  componentWillUnmount = () => {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  };

  componentDidUpdate = (previousProps: Props) => {
    if (this.state.messageTags && this.timer) {
      clearTimeout(this.timer);
    }
    if (this.state.messageTags) {
      this.timer = setTimeout(() => this.setState({ messageTags: "" }), 4000);
    }
    if (this.props.user !== previousProps.user) {
      this.setState({
        tagsUser: this.props.user.tags,
        displayCustom: false,
        tagsList: [],
        customTag: ""
      });
    }
  };

  public render() {
    if (this.state.messageTags && !this.timer) {
      this.timer = setTimeout(() => {
        this.setState({ messageTags: "" });
      }, 4000);
    }
    return (
      <div className={this.props.isOther ? "mct-o" : "media-container"}>
        <div className="title-container-tag">
          <Header as="h3" dividing className="title">
            Some tags that represents me
          </Header>
        </div>
        <div className="tag-container">
          {this.state.tagsUser &&
            this.state.tagsUser.map((tag: UserTags) => (
              <div
                key={tag.tag_id + this.createRandomId(2)}
                className="tag-value ui tag label large"
              >
                <span>{tag.name}</span>
                {!this.props.isOther && (
                  <Icon
                    name="close"
                    onClick={() => {
                      this.deleteTags(tag.name, tag.custom);
                    }}
                  />
                )}
              </div>
            ))}
          {!this.props.isOther && (
            <button
              className="circular ui icon blue button"
              onClick={() => {
                this.setDisplayCustom();
              }}
            >
              <i className="icon plus" />
            </button>
          )}
          {this.state.displayCustom && !this.props.isOther && (
            <div className="custom-tag-container">
              <h1 className="title">Wanna add more ?</h1>
              {this.state.tagsList &&
                this.state.tagsList.map(({ id, name }, index) => (
                  <span key={id} className="tag-value ui tag label">
                    <span
                      onClick={() => {
                        this.selectTags(name, id, index);
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
                      this.setCustomTag(value);
                    }}
                  />
                </div>
                <Button
                  className="ui primary button button-valid-edit-tag"
                  onClick={async () => {
                    this.addTags();
                  }}
                >
                  Add my tag
                </Button>
              </div>
            </div>
          )}
          {this.state.messageTags && (
            <div className="toast-message ui floating message">
              <p>{this.state.messageTags}</p>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default Tags;
