import client from "../../sql/sql.mjs";
import { getUserId, calculateAge, checkBlockedUser } from "../../common.mjs";
import { getUserPictures, getUserTags } from "../profile/getUserInfos.mjs";
import { notifyUser } from "./notifications.mjs";

const logVisit = async (userName, visitedUser) => {
  const visiting_user_id = await getUserId(userName);
  const visited_user_id = await getUserId(visitedUser);
  if (!visiting_user_id || !visited_user_id) {
    return { validated: false };
  } else {
    if (!(await checkBlockedUser(userName, visitedUser))) {
      return {
        validated: false,
        message: "You or this person blocked you, can't log a visit"
      };
    } else {
      let text = `SELECT count(*) FROM user_visit WHERE visiting_user_id = $1 AND visited_user_id = $2`;
      let values = [visiting_user_id, visited_user_id];
      return await client
        .query(text, values)
        .then(async ({ rows: [{ count }] }) => {
          var connectionDate = Math.floor(Date.now());
          text =
            count === "0"
              ? `INSERT INTO user_visit (visiting_user_id, visited_user_id, date) VALUES ($1, $2, '${connectionDate}')`
              : `UPDATE user_visit SET date = '${connectionDate}' WHERE visiting_user_id = $1 AND visited_user_id = $2`;
          let values = [visiting_user_id, visited_user_id];
          return await client
            .query(text, values)
            .then(() => {
              notifyUser(userName, visitedUser, "visit");
              return {
                validated: true,
                message:
                  count === "0"
                    ? "Visit logged sucessfully !"
                    : "Visit updated successfully"
              };
            })
            .catch(e => {
              console.error(e.stack);
              return {
                validated: false,
                message: "We got a problem with our database, please try again"
              };
            });
        })
        .catch(e => {
          console.error(e.stack);
          return {
            validated: false,
            message: "We got a problem with our database, please try agadin"
          };
        });
    }
  }
};

const getUserVisitsAndLikes = async (req, res) => {
  const target_user_id = await getUserId(req.body.userName);
  if (
    !target_user_id ||
    (req.body.current !== "likes" && req.body.current !== "visits")
  ) {
    res.send({ validated: false });
  } else {
    const table = req.body.current === "likes" ? "like" : "visit";
    const tabling = req.body.current === "likes" ? "liking" : "visiting";
    const tabled = req.body.current === "likes" ? "liked" : "visited";
    let text = `SELECT users.user_id,user_name,first_name,last_name,gender,orientation,city,presentation,latitude,longitude,birthday,last_connection,score,${tabling}_user_id,${tabled}_user_id,user_${table}.date,path,main FROM users JOIN user_${table} ON users.user_id = user_${table}.${tabling}_user_id JOIN profile_picture ON users.user_id = profile_picture.user_id WHERE user_${table}.${tabled}_user_id
    = $1 AND profile_picture.main = TRUE ORDER BY user_${table}.date DESC`;
    let values = [target_user_id];
    await client
      .query(text, values)
      .then(async ({ rowCount, rows }) => {
        let userInfoAll = [];
        let visitDate = [];
        for (let i = 0; i < rowCount; i++) {
          userInfoAll.push({
            user_id: rows[i].user_id,
            user_name: rows[i].user_name,
            first_name: rows[i].first_name,
            last_name: rows[i].last_name,
            gender: rows[i].gender,
            orientation: rows[i].orientation,
            city: rows[i].city,
            presentation: rows[i].presentation,
            birthday: rows[i].birthday,
            age: calculateAge(rows[i].birthday),
            connection: rows[i].last_connection,
            pictures: await getUserPictures(rows[i].user_id),
            tags: await getUserTags(rows[i].user_id),
            score: rows[i].score,
            liked: true
          }),
            visitDate.push({
              date: rows[i].date
            });
        }
        res.send({
          validated: true,
          userInfoAll,
          visitDate
        });
      })
      .catch(e => {
        console.error(e.stack);
        res.send({
          validated: false,
          message: "We got a problem with our database, please try again"
        });
      });
  }
};

const visitedUser = async (req, res) => {
  res.send(await logVisit(req.body.userName, req.body.visitedUser));
};

export { visitedUser, logVisit, getUserVisitsAndLikes };
