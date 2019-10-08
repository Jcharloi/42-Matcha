import client from "../../sql/sql.mjs";
import keys from "../../keys.json";

import { getUserId } from "../../common.mjs";
import { compareTag } from "../validInfos.mjs";

import { getUserCoordinatesByCity } from "../../common.mjs";
import { getUserCityByCoordinates } from "../../common.mjs";
import { checkBlockedUser } from "../../common.mjs";
const { ip_city } = keys;

const getUserAll = async (req, res) => {
  let text = `SELECT user_id FROM users WHERE user_name = $1`;
  let values = [req.body.userName];
  await client
    .query(text, values)
    .then(async ({ rowCount, rows }) => {
      if (rowCount > 0) {
        const userId = rows[0].user_id;
        let userInfos = {};
        userInfos = await getUserInfos(userId);
        userInfos.pictures = await getUserPictures(userId);
        userInfos.tags = await getUserTags(userId);
        if (req.body.isOther) {
          const validated = await checkBlockedUser(
            req.body.ourName,
            req.body.userName
          );
          if (validated) {
            res.send({ validated: true, userInfos });
          } else {
            res.send({ validated: false });
          }
        } else {
          res.send({ validated: true, userInfos });
        }
      } else {
        res.send({ validated: false });
      }
    })
    .catch(e => {
      console.error(e);
      res.send("We got a problem with our database, please try again");
    });
};

const getUserInfos = async userId => {
  return await client
    .query(`SELECT * FROM users WHERE user_id = '${userId}'`)
    .then(({ rows }) => {
      const userInfos = {
        user_id: rows[0].user_id,
        mail: rows[0].mail,
        user_name: rows[0].user_name,
        last_name: rows[0].last_name,
        first_name: rows[0].first_name,
        birthday: rows[0].birthday,
        gender: rows[0].gender,
        orientation: rows[0].orientation,
        presentation: rows[0].presentation,
        connection: new Date(rows[0].last_connection * 1000),
        score: rows[0].score,
        city: rows[0].city
      };
      return userInfos;
    })
    .catch(e => {
      console.error(e);
      return {
        message: "We got a problem with our database, please try again"
      };
    });
};

const getUserName = async userId => {
  return await client
    .query(`SELECT * FROM users WHERE user_id = '${userId}'`)
    .then(({ rows }) => {
      const userName = rows[0].user_name;
      return userName;
    })
    .catch(e => {
      console.error(e);
      return {
        message: "We got a problem with our database, please try again"
      };
    });
};

const getUserPictures = async userId => {
  return await client
    .query(
      `SELECT path, date, main FROM profile_picture INNER JOIN users ON(profile_picture.user_id = users.user_id) WHERE users.user_id = '${userId}' ORDER BY main, date DESC`
    )
    .then(({ rows, rowCount }) => {
      let userPictures = [];
      for (let i = 0; i < rowCount; i++) {
        userPictures.push({
          path: rows[i].path,
          date: rows[i].date,
          main: rows[i].main
        });
      }
      userPictures.splice(0, 0, userPictures[userPictures.length - 1]);
      userPictures.splice(userPictures.length - 1, 1);
      return userPictures;
    })
    .catch(e => {
      console.error(e);
      return {
        message: "We got a problem with our database, please try again"
      };
    });
};

const getUserTags = async userId => {
  return await client
    .query(
      `SELECT tag.tag_id, name, custom FROM tag JOIN user_tag ON(user_tag.tag_id = tag.tag_id) WHERE user_tag.user_id = '${userId}'`
    )
    .then(({ rows, rowCount }) => {
      let userTags = [];
      for (let i = 0; i < rowCount; i++) {
        userTags.push({
          tag_id: rows[i].tag_id,
          name: rows[i].name,
          custom: rows[i].custom
        });
      }
      return userTags;
    })
    .catch(e => {
      console.error(e);
      return {
        message: "We got a problem with our database, please try again"
      };
    });
};

const getUserLatitudeAndLongitude = async userId => {
  let text = `SELECT latitude, longitude FROM users WHERE user_id = '${userId}'`;
  return await client
    .query(text)
    .then(({ rows }) => {
      let myCoordinates = {};
      myCoordinates.lat = rows[0].latitude;
      myCoordinates.lon = rows[0].longitude;
      return myCoordinates;
    })
    .catch(e => {
      console.error(e.stack);
    });
};

const getUserCity = async (req, res) => {
  if (!req.body.longitude && !req.body.latitude && !req.body.ip) {
    res.send({ validated: false, message: "Not enough informations" });
  } else {
    let coordinates = {};
    let userInfos = {};
    let next = false;
    if (req.body.latitude != 0 && req.body.longitude != 0) {
      coordinates.lat = req.body.latitude;
      coordinates.lon = req.body.longitude;
      userInfos.city = await getUserCityByCoordinates(
        coordinates.lat,
        coordinates.lon
      );
      next = true;
    } else if (req.body.ip) {
      await fetch(`http://ip.city/api.php?ip=${req.body.ip}&key=${ip_city}`)
        .then(response => response.json())
        .then(({ city }) => {
          userInfos.city = city;
          next = true;
        })
        .catch(e => {
          console.error(e.stack);
          res.send({
            validated: false,
            message: "We got an error with ip city"
          });
        });
      coordinates = await getUserCoordinatesByCity(userInfos.city);
    }

    const userId = await getUserId(req.body.userName);
    if (next) {
      let text = `UPDATE users SET city = '${userInfos.city}', latitude = '${coordinates.lat}', longitude = '${coordinates.lon}' WHERE user_id = '${userId}'`;
      await client
        .query(text)
        .then(() => {
          res.send({ validated: true, userInfos });
        })
        .catch(e => {
          console.error(e);
          res.send({
            validated: false
          });
        });
    }
  }
};

const getAllTags = async (req, res) => {
  const userId = await getUserId(req.body.userName);
  if (!userId) {
    res.send({ validated: false });
  } else {
    let text = `SELECT name, tag_id FROM tag WHERE custom=false`;
    await client
      .query(text)
      .then(async ({ rowCount, rows }) => {
        let tags = [];
        for (let i = 0; i < rowCount; i++) {
          tags.push({
            id: rows[i].tag_id,
            name: rows[i].name
          });
        }
        res.send({ validated: true, tags });
      })
      .catch(e => {
        console.error(e);
        res.send({
          validated: false,
          message: "We got a problem with our database, please try again "
        });
      });
  }
};

const getTags = async (req, res) => {
  const userId = await getUserId(req.body.userName);
  if (!userId) {
    res.send({ validated: false });
  } else {
    let userInfos = {};
    let text = `SELECT name, tag_id FROM tag WHERE custom=false`;
    await client
      .query(text)
      .then(async ({ rowCount, rows }) => {
        let tagsList = [];
        for (let i = 0; i < rowCount; i++) {
          tagsList.push({
            id: rows[i].tag_id,
            name: rows[i].name
          });
        }
        text = `SELECT name, custom FROM tag JOIN user_tag ON(user_tag.tag_id = tag.tag_id) WHERE user_tag.user_id = $1`;
        let values = [userId];
        await client
          .query(text, values)
          .then(({ rowCount, rows }) => {
            if (rowCount > 0) {
              for (let i = 0; i < rowCount; i++) {
                tagsList = compareTag(tagsList, rows[i].name);
              }
            }
            userInfos.tagsList = tagsList;
            res.send({ validated: true, userInfos });
          })
          .catch(e => {
            console.error(e);
            res.send({ validated: false });
          });
      })
      .catch(e => {
        console.error(e);
        res.send({ validated: false });
      });
  }
};

export {
  getUserAll,
  getUserInfos,
  getUserName,
  getUserPictures,
  getUserTags,
  getUserLatitudeAndLongitude,
  getUserCity,
  getAllTags,
  getTags
};
