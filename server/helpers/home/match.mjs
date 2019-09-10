import client from "../../sql/sql.mjs";
import opencage from "opencage-api-client";
import geodist from "geodist";

import { getUserPictures } from "../profile/getUserInfos.mjs";
import { validOrientation } from "../validInfos.mjs";
import { validGender } from "../validInfos.mjs";
import { getUserTags } from "../profile/getUserInfos.mjs";

import keys from "../../keys.json";
const { odg_api_key } = keys;
//Orientation = Man, Woman, Other, Both

/*
//Woman -> Woman | WHERE gender = woman AND (orientation = woman OR orientation = both)
//Woman -> Man | WHERE gender = man AND (orientation = woman OR orientation = both)
//Woman -> Other | WHERE gender = other AND (orientation = woman)
//Woman -> Both | WHERE gender = 'Man' ${orientationForBothWoman} OR gender = 'Woman' ${orientationForBothWoman}

//Man -> Woman | WHERE gender = woman AND (orientation = man OR orientation = both)
//Man -> Man | WHERE gender = man AND (orientation = man OR orientation = both)
//Man -> Other | WHERE gender = other AND (orientation = man)
//Man -> Both | WHERE gender = 'Man' AND (orientation = 'Man' OR orientation = 'Both') OR gender = 'Woman' AND (orientation = 'Man' OR orientation = 'Both')

//Other -> Woman | WHERE gender = woman AND orientation = other
//Other -> Man | WHERE gender = man AND orientation = other
//Other -> Other | WHERE gender = other AND orientation = other
//Other -> Both | WHERE gender = (man AND orientation = other) || (woman AND orientation = other)
*/

const getUserCoordinatesByCity = async city => {
  return await opencage
    .geocode({
      q: `${city}`,
      key: odg_api_key
    })
    .then(data => {
      let coordinates = {};
      if (data.status.code == 200 && data.results.length > 0) {
        coordinates.lat = data.results[0].geometry.lat;
        coordinates.lon = data.results[0].geometry.lng;
      }
      return coordinates;
    })
    .catch(e => {
      console.error(e.stack);
    });
};

const matchByCity = async (res, city, userMatchInfo) => {
  console.log(userMatchInfo[0].city);
  const myCoordinates = await getUserCoordinatesByCity(city);
  //---------------------------------------------------------------------
  const potentialMatchCoordinates = await getUserCoordinatesByCity(
    userMatchInfo[0].city
  );
  console.log(myCoordinates, potentialMatchCoordinates);
  console.log(
    geodist(myCoordinates, potentialMatchCoordinates, {
      unit: "km"
    })
  );
  // res.send({ validated: true, userMatchInfo });
};

const getUsersByPreference = async (req, res) => {
  if (
    validOrientation(req.params.preference) &&
    validGender(req.params.gender)
  ) {
    let text =
      `SELECT user_id, user_name, city, birthday, last_connection FROM users ` +
      getMatchByOrientation(req.params);
    await client
      .query(text)
      .then(async ({ rowCount, rows }) => {
        let userMatchInfo = [];
        //retirer son propre resultat
        for (let i = 0; i < rowCount; i++) {
          userMatchInfo.push({
            score: 0,
            id: rows[i].user_id,
            name: rows[i].user_name,
            city: rows[i].city,
            age: 2019 - rows[i].birthday.split("/")[2],
            connection: new Date(rows[i].last_connection * 1000),
            pictures: await getUserPictures(rows[i].user_id),
            tags: await getUserTags(rows[i].user_id)
          });
        }
        matchByCity(res, req.params.city, userMatchInfo);
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

function getMatchByOrientation(params) {
  let text;

  if (params.gender === "Other") {
    if (params.preference !== "Both") {
      text = `WHERE gender = '${params.preference}' AND orientation = '${params.gender}'`;
    } else {
      text = `WHERE gender = 'Man' AND orientation = 'Other' OR gender = 'Woman' AND orientation = 'Other'`;
    }
  } else {
    if (params.preference !== "Both" && params.preference !== "Other") {
      text = `WHERE gender = '${params.preference}' AND (orientation = '${params.gender}' OR orientation = 'Both')`;
    } else if (params.preference === "Other") {
      text = `WHERE gender = '${params.preference}' AND orientation = '${params.gender}'`;
    } else {
      text = `WHERE gender = 'Man' AND (orientation = '${params.gender}' OR orientation = 'Both') OR gender = 'Woman' AND (orientation = '${params.gender}' OR orientation = 'Both')`;
    }
  }
  return text;
}

export default { getUsersByPreference };
