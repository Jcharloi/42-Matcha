import moment from "moment";
import fs from "fs";
import path from "path";

import client from "../../sql/sql.mjs";
import { validFile } from "../validInfos.mjs";
import { getUserId, createRandomId } from "../../common.mjs";

const uploadPictures = async (req, res) => {
  if (req.files && Object.keys(req.files).length > 0 && req.body.main) {
    const { name, size, mimetype: type } = req.files.file;
    if (validFile(name, size, type)) {
      const userId = await getUserId(req.body.userName);
      if (!userId) {
        res.send({ validated: false });
      } else {
        let text = `SELECT COUNT(*) FROM profile_picture WHERE user_id = '${userId}'`;
        await client
          .query(text)
          .then(async ({ rows }) => {
            if (rows[0].count < "5") {
              let nameChanged =
                name.split(".")[0] +
                createRandomId(5) +
                "." +
                type.split("/")[1];
              let file = req.files.file;
              let date = moment().format("X");
              file.mv(`public/profile-pictures/${nameChanged}`, err => {
                if (err) {
                  return res.status(500).send(err);
                }
              });
              let text = `INSERT INTO profile_picture (user_id, path, date, main) VALUES ($1, $2, $3, $4)`;
              let values = [
                userId,
                nameChanged,
                date,
                req.body.main === "true" ? true : false
              ];
              await client
                .query(text, values)
                .then(() => {
                  res.send({
                    validated: true,
                    date,
                    fileName: nameChanged,
                    message: "Picture uploaded successfully !"
                  });
                })
                .catch(e => {
                  console.error(e.stack);
                  res.send({
                    validated: false,
                    message:
                      "We got a problem with our database, please try again"
                  });
                });
            } else {
              res.send({
                validated: false,
                message: "You already have at least 5 pictures uploaded !"
              });
            }
          })
          .catch(e => {
            console.error(e.stack);
            res.send({
              validated: false,
              message: "We got a problem with our database, please try again"
            });
          });
      }
    } else {
      res.send({
        validated: false,
        message: "Something went wrong with the file format"
      });
    }
  } else {
    res.send({
      validated: false,
      message: "No file ? Or perhaps main parameter is missing"
    });
  }
};

const setMainPictures = async (req, res) => {
  const userId = await getUserId(req.body.userName);
  if (!userId) {
    res.send({ validated: false });
  } else {
    let text = `SELECT path FROM profile_picture WHERE path=$1 AND user_id='${userId}'`;
    let values = [req.body.path];
    await client
      .query(text, values)
      .then(async ({ rowCount }) => {
        if (rowCount > 0) {
          let text = `SELECT path FROM profile_picture WHERE user_id='${userId}' AND main=true`;
          await client
            .query(text)
            .then(async ({ rowCount, rows }) => {
              if (rowCount > 0) {
                text = `UPDATE profile_picture SET main=false WHERE path=$1 AND user_id='${userId}'`;
                let values = [rows[0].path];
                await client
                  .query(text, values)
                  .then(() => {})
                  .catch(e => {
                    console.error(e.stack);
                    res.send({
                      validated: false,
                      message:
                        "We got a problem with our database, please try again"
                    });
                  });
              }
              text = `UPDATE profile_picture SET main=true WHERE path=$1 AND user_id='${userId}'`;
              let values = [req.body.path];
              await client
                .query(text, values)
                .then(() => {
                  res.send({
                    validated: true,
                    message: "Main picture selected successfully !"
                  });
                })
                .catch(e => {
                  console.error(e.stack);
                  res.send({
                    validated: false,
                    message:
                      "We got a problem with our database, please try again"
                  });
                });
            })
            .catch(e => {
              console.error(e);
              res.send({
                validated: false,
                message: "We got a problem with our database, please try again"
              });
            });
        } else {
          res.send({
            validated: false,
            message: "This picture does not exists"
          });
        }
      })
      .catch(e => {
        console.error(e);
        res.send({
          validated: false,
          message: "We got a problem with our database, please try again"
        });
      });
  }
};

const deletePictures = async (req, res) => {
  const userId = await getUserId(req.body.userName);
  if (!userId) {
    res.send({ validated: false });
  } else {
    let text = `SELECT * FROM profile_picture WHERE user_id='${userId}' ORDER BY date DESC`;
    await client
      .query(text)
      .then(async ({ rows, rowCount }) => {
        if (rowCount > 1) {
          let newMainPath;
          if (req.body.main === "true") {
            if (rows[0].main) {
              newMainPath = rows[1].path;
            } else {
              newMainPath = rows[0].path;
            }
          }
          text = `DELETE FROM profile_picture WHERE path=$1 AND user_id = '${userId}'`;
          let values = [req.body.path];
          await client
            .query(text, values)
            .then(async ({ rowCount }) => {
              if (rowCount > 0) {
                text = `SELECT * FROM profile_picture WHERE path=$1`;
                values = [req.body.path];
                await client
                  .query(text, values)
                  .then(async ({ rowCount }) => {
                    if (rowCount === 0) {
                      const pathFile =
                        path.resolve("./public/profile-pictures/") +
                        "/" +
                        req.body.path;
                      if (fs.existsSync(pathFile)) {
                        fs.unlink(pathFile, err => {
                          if (err) {
                            console.error(err);
                            res.send({
                              validated: false,
                              message:
                                "We got a problem while removing the picture, please try again"
                            });
                          }
                        });
                      }
                    }
                    if (req.body.main === "true") {
                      text = `UPDATE profile_picture SET main=true WHERE path='${newMainPath}' AND user_id='${userId}'`;
                      await client.query(text).catch(e => {
                        console.error(e.stack);
                        res.send({
                          validated: false,
                          message:
                            "We got a problem with our database, please try again"
                        });
                      });
                    }
                    res.send({
                      validated: true,
                      message: "Picture deleted successfully !"
                    });
                  })
                  .catch(e => {
                    console.error(e.stack);
                    res.send({
                      validated: false,
                      message:
                        "We got a problem with our database, please try again"
                    });
                  });
              } else {
                res.send({
                  validated: false,
                  message: "This picture does not exists anymore"
                });
              }
            })
            .catch(e => {
              console.error(e.stack);
              res.send({
                validated: false,
                message: "We got a problem with our database, please try again"
              });
            });
        } else {
          res.send({
            validated: false,
            message: "You can't delete your only picture"
          });
        }
      })
      .catch(e => {
        console.error(e.stack);
        res.send({
          validated: false,
          message: "We got a problem with our database, please try again"
        });
      });
  }
};

export { uploadPictures, setMainPictures, deletePictures };
