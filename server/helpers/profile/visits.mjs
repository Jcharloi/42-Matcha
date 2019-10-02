import { getUserId } from "../../common.mjs";
import client from "../../sql/sql.mjs";
import { getUserPictures } from "./getUserInfos.mjs";

const logVisit = async (userName, visitedUser) => {
  const visiting_user_id = await getUserId(userName);
  const visited_user_id = await getUserId(visitedUser);
  if (!visiting_user_id || !visited_user_id) {
    return { validated: false };
  } else {
    let text = `SELECT count(*) FROM user_visit WHERE visiting_user_id = $1 AND visited_user_id = $2`;
    let values = [visiting_user_id, visited_user_id];
    return await client
      .query(text, values)
      .then(async ({ rows: [{ count }] }) => {
        var connectionDate = Math.floor(Date.now() / 1000);
        text =
          count === "0"
            ? `INSERT INTO user_visit (visiting_user_id, visited_user_id, date) VALUES ($1, $2, '${connectionDate}')`
            : `UPDATE user_visit SET date = '${connectionDate}' WHERE visiting_user_id = $1 AND visited_user_id = $2`;
        let values = [visiting_user_id, visited_user_id];
        return await client
          .query(text, values)
          .then(() => {
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
};

const getUserVisits = async (req, res) => {
  const visited_user_id = await getUserId(req.body.userName);
  if (!visited_user_id) {
    res.send({ validated: false });
  } else {
    let text = `SELECT users.user_id,user_name,visiting_user_id,visited_user_id,user_visit.date,path,main FROM users JOIN user_visit ON users.user_id = user_visit.visiting_user_id JOIN profile_picture ON users.user_id = profile_picture.user_id WHERE user_visit.visited_user_id
    = $1 AND profile_picture.main = TRUE`;

    let values = [visited_user_id];
    await client
      .query(text, values)
      .then(async ({ rowCount, rows }) => {
        var rowArray = [];
        rows.map(async (row, index) => {
          rowArray.push(await getUserPictures(row.user_id));
          console.log(rowArray);
        });

        res.send({
          validated: true,
          rows
        });
      })
      .catch(e => {
        console.error(e);
        res.send({
          validated: false,
          message: "We got a problem with oufffr database, please try agadin"
        });
      });
  }
};

const visitedUser = async (req, res) => {
  res.send(await logVisit(req.body.userName, req.body.visitedUser));
};

export { visitedUser, logVisit, getUserVisits };
