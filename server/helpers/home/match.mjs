import client from "../../sql/sql.mjs";
import geodist from "geodist";

import { getUserPictures } from "../profile/getUserInfos.mjs";
import { validOrientation } from "../validInfos.mjs";
import { validGender } from "../validInfos.mjs";
import { getUserTags } from "../profile/getUserInfos.mjs";
import { getUserId } from "../../common.mjs";

//Orientation = Man, Woman, Other, Both
/*
//Woman -> Woman | WHERE gender = woman AND (orientation = woman OR orientation = both)
//Woman -> Man | WHERE gender = man AND (orientation = woman OR orientation = both)
//Woman -> Other | WHERE gender = other AND (orientation = woman OR orientation = both)
//Woman -> Both | WHERE gender = 'Man' ${orientationForBothWoman} OR gender = 'Woman' ${orientationForBothWoman}

//Man -> Woman | WHERE gender = woman AND (orientation = man OR orientation = both)
//Man -> Man | WHERE gender = man AND (orientation = man OR orientation = both)
//Man -> Other | WHERE gender = other AND (orientation = man OR orientation = both)
//Man -> Both | WHERE gender = 'Man' AND (orientation = 'Man' OR orientation = 'Both') OR gender = 'Woman' AND (orientation = 'Man' OR orientation = 'Both')

//Other -> Woman | WHERE gender = woman AND orientation = other
//Other -> Man | WHERE gender = man AND orientation = other
//Other -> Other | WHERE gender = other AND orientation = other
//Other -> Both | WHERE gender = (man AND orientation = other) || (woman AND orientation = other)
*/
function compareTag(myTags, tagUser) {
  return (
    myTags.findIndex(myTag => {
      return myTag.name === tagUser;
    }) != -1
  );
}

const matchByTags = async (myTags, userMatchInfo) => {
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

const matchByCity = async (myCoordinates, userMatchInfo) => {
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
  userMatchInfo.sort(function(a, b) {
    return a.distance - b.distance;
  });
  return userMatchInfo;
};

const getUsersByPreference = async (req, res) => {
  if (validOrientation(req.body.preference) && validGender(req.body.gender)) {
    let text =
      `SELECT user_id, user_name, score, city, latitude, longitude, birthday, last_connection FROM users ` +
      getMatchByOrientation(req.body);
    await client
      .query(text)
      .then(async ({ rowCount, rows }) => {
        let userMatchInfo = [];
        //retirer son propre resultat
        for (let i = 0; i < rowCount; i++) {
          userMatchInfo.push({
            scoreDistance: 0,
            scoreTags: 0,
            id: rows[i].user_id,
            name: rows[i].user_name,
            city: rows[i].city,
            latitude: rows[i].latitude,
            longitude: rows[i].longitude,
            age: 2019 - rows[i].birthday.split("/")[2],
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
        userMatchInfo = await matchByTags(myTags, userMatchInfo);
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

function getMatchByOrientation({ gender, preference }) {
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
}

export default { getUsersByPreference };
