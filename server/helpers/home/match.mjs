import client from "../../sql/sql.mjs";
import geodist from "geodist";

import {
  getUserLatitudeAndLongitude,
  getUserPictures,
  getUserTags
} from "../profile/getUserInfos.mjs";
import { validGender, validOrientation } from "../validInfos.mjs";
import { getUserId } from "../../common.mjs";
import { sortByDistance } from "./sortBy.mjs";

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

const calculateCommonTags = (myTags, userMatchInfo) => {
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

const matchByCity = (myCoordinates, userMatchInfo) => {
  userMatchInfo.map(user => {
    const potentialMatchCoordinates = {
      lat: user.latitude,
      lon: user.longitude
    };
    user.distance = geodist(myCoordinates, potentialMatchCoordinates, {
      unit: "km"
    });
    if (user.distance < 100) {
      user.scoreDistance = 10;
    } else if (user.distance < 200) {
      user.scoreDistance = 5;
    } else {
      user.scoreDistance = 0;
    }
    return user;
  });
  userMatchInfo = sortByDistance(userMatchInfo);
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
    return user.id === userId;
  });
  if (indexYourself != -1) {
    userMatchInfo.splice(indexYourself, 1);
  }
  return userMatchInfo;
};

function getMonthFromString(mon) {
  var d = Date.parse(mon + "2, 2019");
  if (!isNaN(d)) {
    return new Date(d).getMonth() + 1;
  }
  return -1;
}
function calculateAge(birthday) {
  var day = birthday.split("/")[1];
  var month = getMonthFromString(birthday.split("/")[0]);
  var year = birthday.split("/")[2];
  var dob = new Date(+year, +month - 1, +day);
  var diff_ms = Date.now() - dob.getTime();
  var age_dt = new Date(diff_ms);
  return Math.abs(age_dt.getUTCFullYear() - 1970);
}
const getUsersByPreference = async (req, res) => {
  if (validOrientation(req.body.preference) && validGender(req.body.gender)) {
    let text =
      `SELECT user_id, user_name, score, city, latitude, longitude, birthday, gender, last_connection FROM users ` +
      getMatchByOrientation(req.body);
    await client
      .query(text)
      .then(async ({ rowCount, rows }) => {
        let userMatchInfo = [];
        for (let i = 0; i < rowCount; i++) {
          userMatchInfo.push({
            scoreDistance: 0,
            scoreTags: 0,
            id: rows[i].user_id,
            name: rows[i].user_name,
            gender: rows[i].gender,
            city: rows[i].city,
            latitude: rows[i].latitude,
            longitude: rows[i].longitude,
            //get the right age
            age: calculateAge(rows[i].birthday),
            connection: new Date(rows[i].last_connection * 1000),
            pictures: await getUserPictures(rows[i].user_id),
            tags: await getUserTags(rows[i].user_id),
            popularityScore: rows[i].score
          });
        }

        const userId = await getUserId(req.body.userName);
        const myCoordinates = await getUserLatitudeAndLongitude(userId);
        const myTags = await getUserTags(userId);
        userMatchInfo = await matchByCity(myCoordinates, userMatchInfo);
        userMatchInfo = await calculateCommonTags(myTags, userMatchInfo);
        userMatchInfo = await finalSortByMe(userMatchInfo, userId);
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
