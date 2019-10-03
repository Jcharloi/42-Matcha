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
    let text = `SELECT users.user_id,user_name,${tabling}_user_id,${tabled}_user_id,user_${table}.date,path,main FROM users JOIN user_${table} ON users.user_id = user_${table}.${tabling}_user_id JOIN profile_picture ON users.user_id = profile_picture.user_id WHERE user_${table}.${tabled}_user_id
    = $1 AND profile_picture.main = TRUE ORDER BY user_${table}.date DESC`;
    let values = [target_user_id];
    await client
      .query(text, values)
      .then(({ rows }) => {
        res.send({
          validated: true,
          rows
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
