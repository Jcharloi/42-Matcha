import client from "../../sql/sql.mjs";
import {
  getUserPictures,
  getUserTags,
  getUserLatitudeAndLongitude
} from "../profile/getUserInfos.mjs";
import { validIntervalParam, validOrientation } from "../validInfos.mjs";
import {
  calculateDistance,
  calculateAge,
  getUserId,
  compareTag
} from "../../common.mjs";

const getUsersBySearch = async (req, res) => {
  const startAge = parseInt(req.body.startAge);
  const endAge = parseInt(req.body.endAge);
  const startLoc = parseInt(req.body.startLoc);
  const endLoc = parseInt(req.body.endLoc);
  const startPop = parseInt(req.body.startPop);
  const endPop = parseInt(req.body.endPop);
  if (req.body.index === "Tags" && req.body.tagsName.length <= 0) {
    res.send({ validated: false, message: "Something wrong with params" });
  } else {
    if (
      req.body.startAge &&
      req.body.endAge &&
      validIntervalParam(startAge, endAge, 18, 100) &&
      req.body.startLoc &&
      req.body.endLoc &&
      validIntervalParam(startLoc, endLoc, 0, 1000) &&
      req.body.startPop &&
      req.body.endPop &&
      validIntervalParam(startPop, endPop, 0, 100) &&
      (req.body.preference && validOrientation(req.body.preference))
    ) {
      let text =
        `SELECT user_id, user_name, score, city, latitude, longitude, birthday, gender, last_connection FROM users ` +
        selectGender(req.body.preference) +
        ` AND score >= $1 AND score <= $2`;
      let values = [startPop, endPop];
      await client
        .query(text, values)
        .then(async ({ rows, rowCount }) => {
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
              age: calculateAge(rows[i].birthday),
              connection: new Date(rows[i].last_connection * 1000),
              pictures: await getUserPictures(rows[i].user_id),
              tags: await getUserTags(rows[i].user_id),
              popularityScore: rows[i].score
            });
          }
          userMatchInfo = userMatchInfo.filter(user => {
            return user.age >= startAge && user.age <= endAge;
          });
          const userId = await getUserId(req.body.userName);
          const myCoordinates = await getUserLatitudeAndLongitude(userId);
          userMatchInfo = await calculateDistance(myCoordinates, userMatchInfo);
          userMatchInfo = userMatchInfo.filter(user => {
            return user.distance >= startLoc && user.distance <= endLoc;
          });
          if (req.body.tagsName.length > 0) {
            userMatchInfo = userMatchInfo.filter(user => {
              let hasToDelete = false;
              user.tags.map(tag => {
                if (!hasToDelete) {
                  hasToDelete = compareTag(req.body.tagsName, tag.name);
                }
              });
              return hasToDelete;
            });
          }
          res.send({ validated: true, userMatchInfo });
        })
        .catch(e => {
          console.error(e.stack);
          res.send({
            validated: false,
            message: "We got a problem with our database, please try again"
          });
        });
    } else {
      res.send({ validated: false, message: "Something wrong with params" });
    }
  }
};

const selectGender = gender => {
  if (gender === "Both") return "WHERE (gender='Man' OR gender='Woman')";
  else return `WHERE gender='${gender}'`;
};

export { getUsersBySearch };
