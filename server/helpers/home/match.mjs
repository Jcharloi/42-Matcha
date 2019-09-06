import client from "../../sql/sql.mjs";

import { getUserPictures } from "../profile/getUserInfos.mjs";
import { validOrientation } from "../validInfos.mjs";

const getUsersByPreference = async (req, res) => {
  if (validOrientation(req.params.preference)) {
    let text = `SELECT user_id, user_name, city, birthday, last_connection FROM users WHERE gender = $1 AND orientation = $2`;
    //si t'es un mec qui s'interesse aux femmmes
    //tu vas chercher les femmes qui sont AUSSI interessees par les mecs
    //retirer son propre resultat
    let values = [req.params.preference, req.params.gender];
    await client
      .query(text, values)
      .then(async ({ rows }) => {
        let userMatchInfo = {};
        userMatchInfo.id = rows[0].user_id;
        userMatchInfo.name = rows[0].user_name;
        userMatchInfo.city = rows[0].city;
        userMatchInfo.age = 2019 - rows[0].birthday.split("/")[2];
        userMatchInfo.connection = new Date(rows[0].last_connection * 1000);
        userMatchInfo.pictures = await getUserPictures(rows[0].user_id);
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
