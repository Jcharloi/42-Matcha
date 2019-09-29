import client from "../../sql/sql.mjs";

import {
  getUserLatitudeAndLongitude,
  getUserPictures,
  getUserTags
} from "../profile/getUserInfos.mjs";
import { validGender, validOrientation } from "../validInfos.mjs";
import { sortByDistance } from "./sortBy.mjs";
import { getUserId, calculateAge, calculateDistance } from "../../common.mjs";
import { filterByBlocked } from "../../common.mjs";

//Orientation = Man, Woman, Other, Both
/*
  Woman -> Woman | WHERE gender = woman AND (orientation = woman OR orientation = both)
  Woman -> Man | WHERE gender = man AND (orientation = woman OR orientation = both)
  Woman -> Other | WHERE gender = other AND (orientation = woman OR orientation = both)
  Woman -> Both | WHERE gender = 'Man' ${orientationForBothWoman} OR gender = 'Woman' ${orientationForBothWoman}

  Man -> Woman | WHERE gender = woman AND (orientation = man OR orientation = both)
  Man -> Man | WHERE gender = man AND (orientation = man OR orientation = both)
  Man -> Other | WHERE gender = other AND (orientation = man OR orientation = both)
  Man -> Both | WHERE gender = 'Man' AND (orientation = 'Man' OR orientation = 'Both') OR gender = 'Woman' AND (orientation = 'Man' OR orientation = 'Both')

  Other -> Woman | WHERE gender = woman AND orientation = other
  Other -> Man | WHERE gender = man AND orientation = other
  Other -> Other | WHERE gender = other AND orientation = other
  Other -> Both | WHERE gender = (man AND orientation = other) || (woman AND orientation = other)

  10 pts -> 0-100km
  5 pts -> 0-200km -> Retrier apres par rapport aux tags -> Les plus hauts % en premier
  0 pts -> +200km -> Retrier apres par rapport aux tags -> Les plus hauts % en premier
*/

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
        let userMatchInfo = [];
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
            connection: new Date(rows[i].last_connection * 1000),
            pictures: await getUserPictures(rows[i].user_id),
            tags: await getUserTags(rows[i].user_id),
            score: rows[i].score,
            liked: true
          });
        }
        const userId = await getUserId(req.body.userName);
        userMatchInfo = await filterByBlocked(userMatchInfo, userId);
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
        res.send({ validated: true, userMatchInfo });
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

export { getUsersByPreference };
