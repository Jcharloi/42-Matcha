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
import { calculateCommonTags } from "./match.mjs";

const getUsersBySearch = async (req, res) => {
  const startAge = parseInt(req.body.startAge);
  const endAge = parseInt(req.body.endAge);
  const startLoc = parseInt(req.body.startLoc);
  const endLoc = parseInt(req.body.endLoc);
  const startPop = parseInt(req.body.startPop);
  const endPop = parseInt(req.body.endPop);
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
    validOrientation(req.body.preference)
  ) {
    let text =
      `SELECT * FROM users ` +
      selectGender(req.body.preference) +
      ` score >= $1 AND score <= $2`;
    let values = [startPop, endPop];
    await client
      .query(text, values)
      .then(async ({ rows, rowCount }) => {
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
        userMatchInfo = userMatchInfo.filter(user => {
          return user.age >= startAge && user.age <= endAge;
        });
        const userId = await getUserId(req.body.userName);
        const myCoordinates = await getUserLatitudeAndLongitude(userId);
        const myTags = await getUserTags(userId);
        userMatchInfo = await calculateDistance(myCoordinates, userMatchInfo);
        userMatchInfo = await calculateCommonTags(myTags, userMatchInfo);
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
        const indexYourself = userMatchInfo.findIndex(user => {
          return user.user_id === userId;
        });
        if (indexYourself != -1) {
          userMatchInfo.splice(indexYourself, 1);
        }
        userMatchInfo.forEach(user => {
          delete user["longitude"];
          delete user["latitude"];
        });
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
};

const selectGender = gender => {
  if (gender === "Both") return "WHERE (gender='Man' OR gender='Woman') AND";
  else if (gender) return `WHERE gender='${gender}' AND`;
  else return ` WHERE`;
};

export { getUsersBySearch };
