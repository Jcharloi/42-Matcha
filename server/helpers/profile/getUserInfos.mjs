import opencage from "opencage-api-client";
import client from "../../sql/sql.mjs";

import { getUserId } from "../../common.mjs";
import { compareTag } from "../validInfos.mjs";

import keys from "../../keys.json";
const { odg_api_key, ip_city } = keys;

const getUserAll = async (params, res) => {
  let text = `SELECT user_id FROM users WHERE user_name = $1`;
  let values = [params.query.userName];
  await client
    .query(text, values)
    .then(async ({ rows }) => {
      const userId = rows[0].user_id;
      let userInfos = {};
      userInfos = await getUserInfos(userId);
      userInfos.pictures = await getUserPictures(userId);
      userInfos.tags = await getUserTags(userId);
      res.send({ userInfos });
    })
    .catch(e => {
      console.error(e);
      res.send("We got a problem with our database, please try again");
    });
};

export async function getUserInfos(userId) {
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
}

export async function getUserPictures(userId) {
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
}

export async function getUserTags(userId) {
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
}

const getUserCity = async (req, res) => {
  let userInfos = {};
  if (req.body.latitude != 0 && req.body.longitude != 0) {
    await opencage
      .geocode({
        q: `${req.body.latitude}, ${req.body.longitude}`,
        key: odg_api_key,
        language: "fr"
      })
      .then(async data => {
        if (data.status.code == 200 && data.results.length > 0) {
          userInfos.city = data.results[0].components.city;
        }
      })
      .catch(error => {
        console.error(error.message);
        res.send({ validated: false });
      });
  } else if (req.body.ip) {
    await fetch(`https://ip.city/api.php?ip=${req.body.ip}&key=${ip_city}`)
      .then(response => response.json())
      .then(data => {
        userInfos.city = data.city;
      })
      .catch(e => {
        console.error(e);
        res.send({ validated: false });
      });
  }

  let text = `UPDATE users SET city = '${userInfos.city}' WHERE user_name = $1`;
  let values = [req.body.userName];
  await client
    .query(text, values)
    .then(() => {
      res.send({ validated: true, userInfos });
    })
    .catch(e => {
      console.error(e);
      res.send({
        validated: false
      });
    });
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
        let tagsList = {};
        for (let i = 0; i < rowCount; i++) {
          tagsList[rows[i].tag_id] = {
            name: rows[i].name
          };
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

export default { getUserAll, getUserCity, getTags };
