import { getUserId } from "../../common.mjs";
import client from "../../sql/sql.mjs";

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

const visitedUser = async (req, res) => {
  res.send(await logVisit(req.body.userName, req.body.visitedUser));
};

export { visitedUser, logVisit };
