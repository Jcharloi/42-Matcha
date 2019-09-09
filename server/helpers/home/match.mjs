import client from "../../sql/sql.mjs";

import { getUserPictures } from "../profile/getUserInfos.mjs";
import { validOrientation } from "../validInfos.mjs";
import { validGender } from "../validInfos.mjs";

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

const getUsersByPreference = async (req, res) => {
  if (
    validOrientation(req.params.preference) &&
    validGender(req.params.gender)
  ) {
    let text;
    if (req.params.gender === "Other") {
      if (req.params.preference !== "Both") {
        text = `SELECT user_id, user_name, city, birthday, last_connection FROM users WHERE gender = '${req.params.preference}' AND orientation = '${req.params.gender}'`;
      } else {
        text = `SELECT user_id, user_name, city, birthday, last_connection FROM users WHERE gender = 'Man' AND orientation = 'Other' OR gender = 'Woman' AND orientation = 'Other'`;
      }
    } else {
      if (
        req.params.preference !== "Both" &&
        req.params.preference !== "Other"
      ) {
        text = `SELECT user_id, user_name, city, birthday, last_connection FROM users WHERE gender = '${req.params.preference}' AND (orientation = '${req.params.gender}' OR orientation = 'Both')`;
      } else if (req.params.preference === "Other") {
        text = `SELECT user_id, user_name, city, birthday, last_connection FROM users WHERE gender = '${req.params.preference}' AND orientation = '${req.params.gender}'`;
      } else {
        text = `SELECT user_id, user_name, city, birthday, last_connection FROM users WHERE gender = 'Man' AND (orientation = '${req.params.gender}' OR orientation = 'Both') OR gender = 'Woman' AND (orientation = '${req.params.gender}' OR orientation = 'Both')`;
      }
    }
    await client
      .query(text)
      .then(async ({ rowCount, rows }) => {
        let userMatchInfo = [];
        //retirer son propre resultat
        for (let i = 0; i < rowCount; i++) {
          userMatchInfo.push({
            id: rows[i].user_id,
            name: rows[i].user_name,
            city: rows[i].city,
            age: 2019 - rows[i].birthday.split("/")[2],
            connection: new Date(rows[i].last_connection * 1000),
            pictures: await getUserPictures(rows[i].user_id)
          });
        }

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

export default { getUsersByPreference };
