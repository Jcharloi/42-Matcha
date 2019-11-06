import client from "../../sql/sql.mjs";

import {
  getUserLatitudeAndLongitude,
  getUserPictures,
  getUserTags
} from "../profile/getUserInfos.mjs";
import { validGender, validOrientation } from "../validInfos.mjs";
import { sortByDistance } from "./sortBy.mjs";
import {
  getUserId,
  calculateAge,
  calculateDistance,
  filterByBlockedUser,
  filterByIncompletedUser
} from "../../common.mjs";

let userMatchInfo = [];

const compareTag = (myTags, tagUser) => {
  return (
    myTags.findIndex(myTag => {
      return myTag.name === tagUser;
    }) != -1
  );
};

export const calculateCommonTags = (myTags, userMatchInfo) => {
  userMatchInfo.map(user => {
    user.tags.map(userTag => {
      if (compareTag(myTags, userTag.name)) {
        user.scoreTags = user.scoreTags + 1;
      }
    });
    user.scoreTags = Math.floor(
      (100 * user.scoreTags) / ((myTags.length + user.tags.length) / 2)
    );
  });
  return userMatchInfo;
};

const finalSortByMe = (userMatchInfo, userId) => {
  userMatchInfo
    .sort((userA, userB) => {
      if (userA.scoreDistance !== userB.scoreDistance) {
        return userA.scoreDistance - userB.scoreDistance;
      }
      if (userA.scoreDistance === 10 && userB.scoreDistance === 10) {
        return userB.distance - userA.distance;
      } else {
        return userA.scoreTags - userB.scoreTags;
      }
    })
    .reverse();
  const indexYourself = userMatchInfo.findIndex(user => {
    return user.user_id === userId;
  });
  if (indexYourself != -1) {
    userMatchInfo.splice(indexYourself, 1);
  }
  return userMatchInfo;
};

const getUsersByPreference = async (req, res) => {
  if (validOrientation(req.body.preference) && validGender(req.body.gender)) {
    let text = `SELECT * FROM users ` + getMatchByOrientation(req.body);
    await client
      .query(text)
      .then(async ({ rowCount, rows }) => {
        if (userMatchInfo.length > 0) userMatchInfo = [];
        for (let i = 0; i < rowCount; i++) {
          userMatchInfo.push({
            scoreDistance: 0,
            scoreTags: 0,
            user_id: rows[i].user_id,
            user_name: rows[i].user_name,
            first_name: rows[i].first_name,
            last_name: rows[i].last_name,
            gender: rows[i].gender,
            orientation: rows[i].orientation,
            city: rows[i].city,
            presentation: rows[i].presentation,
            latitude: rows[i].latitude,
            longitude: rows[i].longitude,
            birthday: rows[i].birthday,
            age: calculateAge(rows[i].birthday),
            connection: rows[i].last_connection,
            pictures: await getUserPictures(rows[i].user_id),
            tags: await getUserTags(rows[i].user_id),
            score: rows[i].score,
            liked: true
          });
        }
        const userId = await getUserId(req.body.userName);
        userMatchInfo = await filterByBlockedUser(userMatchInfo, userId);
        userMatchInfo = await filterByIncompletedUser(userMatchInfo);
        const myCoordinates = await getUserLatitudeAndLongitude(userId);
        const myTags = await getUserTags(userId);
        userMatchInfo = await calculateDistance(myCoordinates, userMatchInfo);
        userMatchInfo = await sortByDistance(userMatchInfo);
        userMatchInfo = await calculateCommonTags(myTags, userMatchInfo);
        userMatchInfo = await finalSortByMe(userMatchInfo, userId);
        userMatchInfo.forEach(user => {
          delete user["longitude"];
          delete user["latitude"];
        });
        res.send({
          validated: true
        });
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
      message: "We got an error with preference string"
    });
  }
};

const getMatchByOrientation = ({ gender, preference }) => {
  let text;

  if (gender === "Other") {
    if (preference !== "Both") {
      text = `WHERE gender = '${preference}' AND orientation = '${gender}'`;
    } else {
      text = `WHERE gender = 'Man' AND orientation = 'Other' OR gender = 'Woman' AND orientation = 'Other'`;
    }
  } else {
    if (preference !== "Both") {
      text = `WHERE gender = '${preference}' AND (orientation = '${gender}' OR orientation = 'Both')`;
    } else {
      text = `WHERE gender = 'Man' AND (orientation = '${gender}' OR orientation = 'Both') OR gender = 'Woman' AND (orientation = '${gender}' OR orientation = 'Both')`;
    }
  }
  return text;
};

export { getUsersByPreference, userMatchInfo };
