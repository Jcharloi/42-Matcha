import { getUserId } from "../../common.mjs";
import client from "../../sql/sql.mjs";

const logVisit = async (req, res) => {
  const visiting_user_id = await getUserId(req.body.userName);
  const visited_user_id = await getUserId(req.body.visitedUser);
  if (!visiting_user_id || !visited_user_id) {
    res.send({ validated: false });
  } else {
    let text = `SELECT * FROM visits WHERE visiting_user_id = $1 AND visited_user_id = $2`;
    let values = [visiting_user_id, visited_user_id];
    await client
      .query(text, values)
      .then(async ({ rowCount }) => {
        var connectionDate = Math.floor(Date.now() / 1000);
        if (rowCount === 0) {
          let text = `INSERT INTO visits (visiting_user_id, visited_user_id, date) VALUES ($1, $2, '${connectionDate}')`;
          let values = [visiting_user_id, visited_user_id];
          await client
            .query(text, values)
            .then(() => {
              res.send({
                validated: true,
                message: "Visit logged sucessfully !"
              });
            })
            .catch(e => {
              console.error(e);
              res.send({
                validated: false,
                message: "We got a problem with our database, please try again"
              });
            });
        } else {
          let text = `UPDATE visits SET date = '${connectionDate}' WHERE visiting_user_id = $1 AND visited_user_id = $2`;
          let values = [visiting_user_id, visited_user_id];
          await client
            .query(text, values)
            .then(() => {
              res.send({
                validated: true,
                message: "Visit updated successfully !"
              });
            })
            .catch(e => {
              console.error(e);
              res.send({
                validated: false,
                message: "We got a problem with our database, please try agacin"
              });
            });
        }
      })
      .catch(e => {
        console.error(e);
        res.send({
          validated: false,
          message: "We got a problem with our database, please try agadin"
        });
      });
  }
};
export { logVisit };