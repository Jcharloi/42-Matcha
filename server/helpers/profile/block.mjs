import { getUserId } from "../../common.mjs";

import client from "../../sql/sql.mjs";

const blockUser = async (req, res) => {
  const userId = await getUserId(req.body.userName);
  let text = `INSERT INTO user_block (blocking_user_id, blocked_user_id) VALUES ($1, $2)`;
  let values = [userId, req.body.blockedUserId];
  await client
    .query(text, values)
    .then(() => {
      res.send({
        validated: true,
        message: "User blocked successfully!"
      });
    })
    .catch(e => {
      console.error(e);
      res.send({
        validated: false,
        message: "We got a problem with our database, please try again"
      });
    });
};

export { blockUser };
