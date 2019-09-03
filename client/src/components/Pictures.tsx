import * as React from "react";
import Axios from "axios";

import { Image, Icon } from "semantic-ui-react";
import "../styles/stylesUserPictures.css";

import { connect } from "react-redux";
import { State } from "../redux/types/types";
import { store } from "../redux/store";

import { insertUserProfile, updateUserAuth } from "../redux/actions/actions";
import { deleteUser, isProfileCompleted } from "../App";

interface PicturesState {
  displayPictures: boolean;
  picturesNb: number;
  pictureIndex: number;
  messagePictures?: string | null;
}

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

class Pictures extends React.Component<Props, PicturesState> {
  constructor(props: Props) {
    super(props);
    this.state = {
      picturesNb: this.props.pictures.length,
      pictureIndex: 0,
      displayPictures: false
    };
  }

  uploadPicture = async ({ target }: any) => {
    if (target.files && target.files.length > 0) {
      const valid = validFile(target.files[0]);
      if (!valid.valid) {
        this.setState({ messagePictures: valid.message });
      } else {
        const isUnknownPicture =
          this.props.pictures[0].date === "1" ? true : false;
        const data = new FormData();
        data.append("file", target.files[0]);
        data.append("userName", String(localStorage.getItem("user_name")));
        data.append("token", String(localStorage.getItem("token")));
        data.append(
          "main",
          this.props.pictures[0].date === "1" ? "true" : "false"
        );
        await Axios.post("http://localhost:5000/profile/upload-pictures/", data)
          .then(async ({ data: { validToken, fileName, date, message } }) => {
            if (validToken === false) {
              deleteUser();
            } else {
              let newPictures = [{ date: "", path: "", main: false }];
              if (!isUnknownPicture) {
                newPictures = [
                  ...this.props.pictures,
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
                ...this.props,
                pictures: newPictures
              };
              store.dispatch(insertUserProfile(newData));
              let isCompleted = isProfileCompleted(
                this.props.city,
                this.props.gender,
                this.props.presentation,
                this.props.pictures,
                this.props.tags
              );
              store.dispatch(updateUserAuth({ isAuth: true, isCompleted }));
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
      path: this.props.pictures[this.state.pictureIndex].path,
      token: localStorage.getItem("token"),
      userName: localStorage.getItem("user_name")
    })
      .then(({ data: { validToken, validated, message } }) => {
        if (validToken === false) {
          deleteUser();
        } else {
          if (validated) {
            let newPictures = this.props.pictures;
            newPictures.map((picture: any) => {
              if (picture.main) {
                picture.main = false;
              }
              if (
                picture.path ===
                this.props.pictures[this.state.pictureIndex].path
              ) {
                picture.main = true;
              }
            });
            const newData = {
              ...this.props,
              pictures: newPictures
            };
            store.dispatch(insertUserProfile(newData));
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
        path: this.props.pictures[this.state.pictureIndex].path,
        token: localStorage.getItem("token"),
        userName: localStorage.getItem("user_name")
      })
        .then(async ({ data: { validToken, validated, message } }) => {
          if (validToken === false) {
            deleteUser();
          } else {
            if (validated) {
              let newPictures = this.props.pictures;
              if (this.props.pictures[this.state.pictureIndex].main) {
                newPictures[1].main = true;
                const newMainPath = newPictures[1].path;
                await Axios.put(
                  "http://localhost:5000/profile/set-main-pictures",
                  {
                    path: newMainPath,
                    token: localStorage.getItem("token"),
                    userName: localStorage.getItem("user_name")
                  }
                )
                  .then(({ data: { validToken, validated, message } }) => {
                    if (validToken === false) {
                      deleteUser();
                    } else {
                      if (validated) {
                        this.setState({
                          messagePictures: message
                        });
                      }
                    }
                  })
                  .catch(error => console.error(error));
              }
              newPictures.splice(this.state.pictureIndex, 1);
              const newData = {
                ...this.props,
                pictures: newPictures
              };
              this.setState({
                pictureIndex: 0,
                picturesNb: this.state.picturesNb - 1
              });
              store.dispatch(insertUserProfile(newData));
            }
            this.setState({ messagePictures: message });
          }
        })
        .catch(error => console.error(error));
    } else {
      this.setState({
        messagePictures: "You can't delete your only picture"
      });
    }
  };

  public render() {
    return (
      <div>
        <div className="body-container">
          <span
            className="image-container"
            key={this.props.pictures[this.state.pictureIndex].date}
          >
            <Image
              className="image"
              circular
              src={`http://localhost:5000/public/profile-pictures/${this.props.pictures[0].path}`}
              onClick={() => {
                if (this.props.pictures[0].date !== "1") {
                  this.setState({ displayPictures: true });
                }
              }}
            />
          </span>
          {this.state.picturesNb < 5 && (
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
                <div className="message-picture">
                  {this.state.messagePictures}
                </div>
              )}
            </div>
          )}
        </div>
        {this.state.displayPictures && (
          <div
            className="hidden-container"
            onClick={() => {
              this.setState({ displayPictures: false });
            }}
          >
            <div className="display-image-container">
              <div className="picture-arrows">
                <Icon
                  name="arrow left"
                  className="picture-arrow-left"
                  size="huge"
                  onClick={(event: Event) => {
                    event.stopPropagation();
                    const pictureIndex =
                      this.state.pictureIndex === 0
                        ? this.props.pictures.length - 1
                        : this.state.pictureIndex - 1;
                    this.setState({
                      pictureIndex
                    });
                  }}
                />
                <div className="managing-picture">
                  <Icon
                    name={
                      this.props.pictures[this.state.pictureIndex].main
                        ? "star"
                        : "star outline"
                    }
                    className="star-icon"
                    size="big"
                    onClick={this.setMainPicture}
                  />
                  <Image
                    key={this.props.pictures[this.state.pictureIndex].date}
                    className="image-inside"
                    size="big"
                    src={`http://localhost:5000/public/profile-pictures/${this.props.pictures[this.state.pictureIndex].path}`}
                  />
                  <Icon
                    name="trash alternate"
                    className="trash-icon"
                    size="big"
                    onClick={this.deletePicture}
                  />
                </div>
                <Icon
                  name="arrow right"
                  className="picture-arrow-right"
                  size="huge"
                  onClick={(event: Event) => {
                    event.stopPropagation();
                    const pictureIndex =
                      this.state.pictureIndex === this.props.pictures.length - 1
                        ? 0
                        : this.state.pictureIndex + 1;
                    this.setState({
                      pictureIndex
                    });
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

const mapStateToProps = (state: State): Props => {
  return {
    ...state.user,
    pictures:
      state.user.pictures && state.user.pictures.length > 0
        ? state.user.pictures
        : [{ date: "1", path: "unknown.png", main: false }]
  };
};

export default connect(mapStateToProps)(Pictures);
