import { getUserId } from "../../common.mjs";

import client from "../../sql/sql.mjs";

const sanctioningUser = async (req, res) => {
  const userId = await getUserId(req.body.userName);
  if (
    !userId ||
    (req.body.action !== "Report" && req.body.action !== "Block")
  ) {
    res.send({
      validated: false,
      message: "Wrong format of params"
    });
  } else {
    let text;
    if (req.body.action === "Report") {
      text = `INSERT INTO user_report (reporting_user_id, reported_user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`;
    } else {
      text = `INSERT INTO user_block (blocking_user_id, blocked_user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`;
    }
    let values = [userId, req.body.targetUserId];
    await client
      .query(text, values)
      .then(async ({ rowCount }) => {
        let message =
          rowCount === 1
            ? "User reported succesfully !"
            : "This user is already reported !";
        text = `DELETE FROM user_like WHERE (liking_user_id = $1 OR liking_user_id = $2) AND (liked_user_id = $1 OR liked_user_id = $2)`;
        values = [userId, req.body.targetUserId];
        await client
          .query(text, values)
          .then(async () => {
            text = `DELETE FROM user_visit WHERE (visiting_user_id = $1 OR visiting_user_id = $2) AND (visited_user_id = $1 OR visited_user_id = $2)`;
            values = [userId, req.body.targetUserId];
            await client
              .query(text, values)
              .then(() => {
                res.send({
                  validated: true,
                  message
                });
              })
              .catch(e => {
                console.error(e.stack);
                res.send({
                  validated: false,
                  message:
                    "We got a problem with our database, please try again"
                });
              });
          })
          .catch(e => {
            console.error(e.stack);
            res.send({
              validated: false,
              message: "We got a problem with our database, please try again"
            });
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

export { sanctioningUser };
