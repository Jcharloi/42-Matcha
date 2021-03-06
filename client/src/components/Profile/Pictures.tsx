import * as React from "react";
import Axios from "axios";
import { store } from "../../redux/store";

import { insertUserProfile, updateUserAuth } from "../../redux/actions/actions";
import { deleteUser, isProfileCompleted } from "../../App";
import { User } from "../../models/models";

import { Image, Icon } from "semantic-ui-react";
import "../../styles/stylesUserPictures.css";

interface Props {
  isOther: boolean;
  user: User;
}

interface PicturesState {
  pictures: Array<{
    path: string;
    date: string;
    main: boolean;
  }>;
  displayPictures: boolean;
  picturesNb: number;
  pictureIndex: number;
  messagePictures?: string | null;
}

class Pictures extends React.Component<Props, PicturesState> {
  constructor(props: Props) {
    super(props);
    this.state = {
      pictures: this.props.user.pictures,
      picturesNb: this.props.user.pictures.length,
      pictureIndex: 0,
      displayPictures: false
    };
  }
  timer!: any;
  _isMounted = false;

  componentDidMount = () => {
    this._isMounted = true;
  };

  uploadPicture = ({ target }: any) => {
    if (target.files && target.files.length > 0) {
      const valid = this.validFile(target.files[0]);
      if (!valid.valid) {
        if (this.timer) clearTimeout(this.timer);
        this.setState({ messagePictures: valid.message });
      } else {
        const isUnknownPicture =
          this.state.pictures[0].date === "1" ? true : false;
        const data = new FormData();
        data.append("file", target.files[0]);
        data.append("userName", String(localStorage.getItem("user_name")));
        data.append("token", String(localStorage.getItem("token")));
        data.append(
          "main",
          this.state.pictures[0].date === "1" ? "true" : "false"
        );
        Axios.post("http://localhost:5000/profile/upload-pictures/", data)
          .then(
            ({ data: { validToken, validated, fileName, date, message } }) => {
              if (validToken === false) {
                deleteUser();
              } else {
                if (validated) {
                  let newPictures = [{ date: "", path: "", main: false }];
                  if (!isUnknownPicture) {
                    newPictures = [
                      ...this.state.pictures,
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
                    this.state.pictures,
                    this.props.user.tags
                  );
                  store.dispatch(updateUserAuth({ isAuth: true, isCompleted }));
                  if (this.timer) {
                    clearTimeout(this.timer);
                    this.timer = null;
                  }
                  this._isMounted &&
                    this.setState({
                      pictures: newData.pictures,
                      picturesNb: isUnknownPicture
                        ? this.state.picturesNb
                        : this.state.picturesNb + 1
                    });
                }
                this._isMounted && this.setState({ messagePictures: message });
              }
            }
          )
          .catch(error => console.error(error));
      }
    }
  };

  setMainPicture = async (event: Event) => {
    event.stopPropagation();
    await Axios.put("http://localhost:5000/profile/set-main-pictures", {
      path: this.state.pictures[this.state.pictureIndex].path,
      token: localStorage.getItem("token"),
      userName: localStorage.getItem("user_name")
    })
      .then(({ data: { validToken, validated, message } }) => {
        if (validToken === false) {
          deleteUser();
        } else {
          if (validated) {
            let newPictures = this.state.pictures;
            newPictures.map((picture: any) => {
              if (picture.main) {
                picture.main = false;
              }
              if (
                picture.path ===
                this.state.pictures[this.state.pictureIndex].path
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
            this._isMounted && this.setState({ pictures: newData.pictures });
          }
          if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
          }
          this._isMounted &&
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
        path: this.state.pictures[this.state.pictureIndex].path,
        main: this.state.pictures[this.state.pictureIndex].main
          ? "true"
          : "false",
        token: localStorage.getItem("token"),
        userName: localStorage.getItem("user_name")
      })
        .then(({ data: { validToken, validated, message } }) => {
          if (validToken === false) {
            deleteUser();
          } else {
            if (validated) {
              let newPictures = this.state.pictures;
              if (this.state.pictures[this.state.pictureIndex].main) {
                newPictures[1].main = true;
              }
              newPictures.splice(this.state.pictureIndex, 1);
              const newData = {
                ...this.props.user,
                pictures: newPictures
              };
              this._isMounted &&
                this.setState({
                  pictures: newData.pictures,
                  pictureIndex: 0,
                  picturesNb: this.state.picturesNb - 1
                });
              store.dispatch(insertUserProfile(newData));
            }
            if (this.timer) {
              clearTimeout(this.timer);
              this.timer = null;
            }
            this._isMounted && this.setState({ messagePictures: message });
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
    if (this.state.pictures[0].date !== "1") {
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
        ? this.state.pictures.length - 1
        : this.state.pictureIndex - 1;
    this.setState({
      pictureIndex
    });
  };

  showRightPicture = (event: Event) => {
    event.stopPropagation();
    const pictureIndex =
      this.state.pictureIndex === this.state.pictures.length - 1
        ? 0
        : this.state.pictureIndex + 1;
    this.setState({
      pictureIndex
    });
  };

  componentWillUnmount = () => {
    clearTimeout(this.timer);
    this.timer = null;
    this._isMounted = false;
  };

  validFile = (file: File): { valid: boolean; message?: string } => {
    let picExist = false;
    this.props.user.pictures.forEach(picture => {
      if (picture.path === file.name) picExist = true;
    });
    if (picExist) {
      return {
        valid: false,
        message: "You already uploaded a picture with this name"
      };
    }
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
    if (this.props.user.pictures)
      if (file.size > 1000000) {
        return {
          valid: false,
          message: "File size max accepted : 1Mb"
        };
      }
    return {
      valid: true
    };
  };

  componentDidUpdate = (previousProps: Props) => {
    if (this.state.messagePictures && this.timer) {
      clearTimeout(this.timer);
    }
    if (this.state.messagePictures) {
      this.timer = setTimeout(
        () => this.setState({ messagePictures: "" }),
        4000
      );
    }
    if (this.props.user.user_id !== previousProps.user.user_id) {
      this.setState({
        pictures: this.props.user.pictures,
        picturesNb: this.props.user.pictures.length,
        pictureIndex: 0,
        displayPictures: false
      });
    }
  };

  public render() {
    return (
      <div className="body-container">
        <span
          className={`image-container ${this.props.isOther ? "ic-o" : ""}`}
          key={this.state.pictures[this.state.pictureIndex].date}
        >
          <Image
            className="photo"
            circular
            src={`http://localhost:5000/public/profile-pictures/${this.state.pictures[0].path}`}
            onClick={this.setDisplayPictures}
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
              <div className="toast-message ui floating message">
                <p>{this.state.messagePictures}</p>
              </div>
            )}
          </div>
        )}
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
                        this.state.pictures[this.state.pictureIndex].main
                          ? "star"
                          : "star outline"
                      }
                      className="star-icon"
                      size="big"
                      onClick={this.setMainPicture}
                    />
                  )}
                  <Image
                    key={this.state.pictures[this.state.pictureIndex].date}
                    className="image-inside"
                    size="big"
                    src={`http://localhost:5000/public/profile-pictures/${this.state.pictures[this.state.pictureIndex].path}`}
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

export default Pictures;
