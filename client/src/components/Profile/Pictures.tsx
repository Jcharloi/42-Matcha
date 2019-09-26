import * as React from "react";
import Axios from "axios";

import { Image, Icon } from "semantic-ui-react";
import "../../styles/stylesUserPictures.css";

import { store } from "../../redux/store";

import { insertUserProfile, updateUserAuth } from "../../redux/actions/actions";
import { deleteUser, isProfileCompleted } from "../../App";
import { User } from "../../models/models";

interface Props {
  isOther: boolean;
  user: User;
}

interface PicturesState {
  displayPictures: boolean;
  picturesNb: number;
  pictureIndex: number;
  messagePictures?: string | null;
}

class Pictures extends React.Component<Props, PicturesState> {
  constructor(props: Props) {
    super(props);
    this.state = {
      picturesNb: this.props.user.pictures.length,
      pictureIndex: 0,
      displayPictures: false
    };
  }
  timer!: any;

  uploadPicture = async ({ target }: any) => {
    if (target.files && target.files.length > 0) {
      const valid = validFile(target.files[0]);
      if (!valid.valid) {
        if (this.timer) clearTimeout(this.timer);
        this.setState({ messagePictures: valid.message });
      } else {
        const isUnknownPicture =
          this.props.user.pictures[0].date === "1" ? true : false;
        const data = new FormData();
        data.append("file", target.files[0]);
        data.append("userName", String(localStorage.getItem("user_name")));
        data.append("token", String(localStorage.getItem("token")));
        data.append(
          "main",
          this.props.user.pictures[0].date === "1" ? "true" : "false"
        );
        await Axios.post("http://localhost:5000/profile/upload-pictures/", data)
          .then(async ({ data: { validToken, fileName, date, message } }) => {
            if (validToken === false) {
              deleteUser();
            } else {
              let newPictures = [{ date: "", path: "", main: false }];
              if (!isUnknownPicture) {
                newPictures = [
                  ...this.props.user.pictures,
                  {
                    path: fileName,
                    date,
                    main: false
                  }
                ];
              } else {
                newPictures[0] = {
                  path: fileName,
                  date,
                  main: true
                };
              }
              const newData = {
                ...this.props.user,
                pictures: newPictures
              };
              store.dispatch(insertUserProfile(newData));
              let isCompleted = isProfileCompleted(
                this.props.user.city,
                this.props.user.gender,
                this.props.user.presentation,
                this.props.user.pictures,
                this.props.user.tags
              );
              store.dispatch(updateUserAuth({ isAuth: true, isCompleted }));
              if (this.timer) {
                clearTimeout(this.timer);
                this.timer = null;
              }
              this.setState({
                picturesNb: isUnknownPicture
                  ? this.state.picturesNb
                  : this.state.picturesNb + 1,
                messagePictures: message
              });
            }
          })
          .catch(error => console.error(error));
      }
    }
  };

  setMainPicture = async (event: Event) => {
    event.stopPropagation();
    await Axios.put("http://localhost:5000/profile/set-main-pictures", {
      path: this.props.user.pictures[this.state.pictureIndex].path,
      token: localStorage.getItem("token"),
      userName: localStorage.getItem("user_name")
    })
      .then(({ data: { validToken, validated, message } }) => {
        if (validToken === false) {
          deleteUser();
        } else {
          if (validated) {
            let newPictures = this.props.user.pictures;
            newPictures.map((picture: any) => {
              if (picture.main) {
                picture.main = false;
              }
              if (
                picture.path ===
                this.props.user.pictures[this.state.pictureIndex].path
              ) {
                picture.main = true;
              }
              return 1;
            });
            const newData = {
              ...this.props.user,
              pictures: newPictures
            };
            store.dispatch(insertUserProfile(newData));
          }
          if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
          }
          this.setState({
            messagePictures: message
          });
        }
      })
      .catch(error => console.error(error));
  };

  deletePicture = async (event: Event) => {
    event.stopPropagation();
    if (this.state.picturesNb > 1) {
      await Axios.put("http://localhost:5000/profile/delete-pictures", {
        path: this.props.user.pictures[this.state.pictureIndex].path,
        main: this.props.user.pictures[this.state.pictureIndex].main
          ? "true"
          : "false",
        token: localStorage.getItem("token"),
        userName: localStorage.getItem("user_name")
      })
        .then(async ({ data: { validToken, validated, message } }) => {
          if (validToken === false) {
            deleteUser();
          } else {
            if (validated) {
              let newPictures = this.props.user.pictures;
              if (this.props.user.pictures[this.state.pictureIndex].main) {
                newPictures[1].main = true;
              }
              newPictures.splice(this.state.pictureIndex, 1);
              const newData = {
                ...this.props.user,
                pictures: newPictures
              };
              this.setState({
                pictureIndex: 0,
                picturesNb: this.state.picturesNb - 1
              });
              store.dispatch(insertUserProfile(newData));
            }
            if (this.timer) {
              clearTimeout(this.timer);
              this.timer = null;
            }
            this.setState({ messagePictures: message });
          }
        })
        .catch(error => console.error(error));
    } else {
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      this.setState({
        messagePictures: "You can't delete your only picture"
      });
    }
  };

  setDisplayPictures = () => {
    if (this.props.user.pictures[0].date !== "1") {
      this.setState({ displayPictures: true });
    }
  };

  setDisplayPicturesFalse = () => {
    this.setState({ displayPictures: false });
  };

  showLeftPicture = (event: Event) => {
    event.stopPropagation();
    const pictureIndex =
      this.state.pictureIndex === 0
        ? this.props.user.pictures.length - 1
        : this.state.pictureIndex - 1;
    this.setState({
      pictureIndex
    });
  };

  showRightPicture = (event: Event) => {
    event.stopPropagation();
    const pictureIndex =
      this.state.pictureIndex === this.props.user.pictures.length - 1
        ? 0
        : this.state.pictureIndex + 1;
    this.setState({
      pictureIndex
    });
  };

  componentWillUnmount = () => {
    clearTimeout(this.timer);
    this.timer = null;
  };

  public render() {
    if (this.state.messagePictures && !this.timer) {
      this.timer = setTimeout(
        () => this.setState({ messagePictures: "" }),
        4000
      );
    }
    return (
      <div>
        {this.props.user}
        <div className="body-container">
          <span
            className={`image-container ${this.props.isOther ? "ic-o" : ""}`}
            key={this.props.user.pictures[this.state.pictureIndex].date}
          >
            <Image
              className="image"
              circular
              src={`http://localhost:5000/public/${
                this.props.isOther ? "fake-pictures" : "profile-pictures"
              }/${this.props.user.pictures[0].path}`}
              onClick={() => {
                this.setDisplayPictures();
              }}
            />
          </span>
          {this.state.picturesNb < 5 && !this.props.isOther && (
            <div className="picture-upload-container">
              <label className="ui primary button">
                <Icon name="upload" />
                <input
                  className="file-upload"
                  type="file"
                  name="file"
                  accept="image/png, image/jpeg, image/jpg"
                  onChange={this.uploadPicture}
                />
                Upload a picture
              </label>
              {this.state.messagePictures && (
                <div className="toast-message ui blue floating message">
                  <p>{this.state.messagePictures}</p>
                </div>
              )}
            </div>
          )}
        </div>
        {this.state.displayPictures && (
          <div
            className="hidden-container"
            onClick={() => {
              this.setDisplayPicturesFalse();
            }}
          >
            <div className="display-image-container">
              <div className="picture-arrows">
                <Icon
                  name="arrow left"
                  className="picture-arrow-left"
                  size="huge"
                  onClick={(event: Event) => {
                    this.showLeftPicture(event);
                  }}
                />
                <div className="managing-picture">
                  {!this.props.isOther && (
                    <Icon
                      name={
                        this.props.user.pictures[this.state.pictureIndex].main
                          ? "star"
                          : "star outline"
                      }
                      className="star-icon"
                      size="big"
                      onClick={this.setMainPicture}
                    />
                  )}
                  <Image
                    key={this.props.user.pictures[this.state.pictureIndex].date}
                    className="image-inside"
                    size="big"
                    src={`http://localhost:5000/public/${
                      this.props.isOther ? "fake-pictures" : "profile-pictures"
                    }/${
                      this.props.user.pictures[this.state.pictureIndex].path
                    }`}
                  />
                  {!this.props.isOther && (
                    <Icon
                      name="trash alternate"
                      className="trash-icon"
                      size="big"
                      onClick={this.deletePicture}
                    />
                  )}
                </div>
                <Icon
                  name="arrow right"
                  className="picture-arrow-right"
                  size="huge"
                  onClick={(event: Event) => {
                    this.showRightPicture(event);
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

function validFile(file: File): { valid: boolean; message?: string } {
  if (
    file.type !== "image/png" &&
    file.type !== "image/jpeg" &&
    file.type !== "image/jpg"
  ) {
    return {
      valid: false,
      message: "File type accepted : png, jpeg and jpeg"
    };
  }
  if (file.size > 1000000) {
    return {
      valid: false,
      message: "File size max accepted : 1Mb"
    };
  }
  return {
    valid: true
  };
}

export default Pictures;
