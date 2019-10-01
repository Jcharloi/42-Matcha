import { getUserId } from "../../common.mjs";

import client from "../../sql/sql.mjs";

const disconnect = async (req, res) => {
  const userId = await getUserId(req.body.userName);
  if (!userId) {
    res.send({ validated: false });
  } else {
    const text = `UPDATE users SET last_connection='${Math.floor(
      Date.now() / 1000
    )}' WHERE user_id = '${userId}'`;
    await client
      .query(text)
      .then(() => {
        res.send({ validated: true });
      })
      .catch(e => {
        console.error(e.stack);
        res.send({ validated: false });
      });
  }
};

export { disconnect };
