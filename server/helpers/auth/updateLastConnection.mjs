import { getUserId } from "../../common.mjs";

import client from "../../sql/sql.mjs";

const updateLastConnection = async userId => {
  const text = `UPDATE users SET last_connection='${Math.floor(
    Date.now()
  )}' WHERE user_id = '${userId}'`;
  return await client
    .query(text)
    .then(() => {
      return true;
    })
    .catch(e => {
      console.error(e.stack);
      return false;
    });
};

const disconnect = async (req, res) => {
  const userId = await getUserId(req.body.userName);
  if (!userId) {
    res.send({ validated: false });
  } else {
    res.send({ validated: await updateLastConnection(userId) });
  }
};

const checkConnection = async (req, res) => {
  const userId = await getUserId(req.body.userName);
  if (!userId) {
    res.send({ validated: false });
  } else {
    let text = `SELECT last_connection FROM users WHERE user_id = '${userId}'`;
    await client
      .query(text)
      .then(({ rows: [{ last_connection }] }) => {
        const difference = Math.floor(Date.now()) - last_connection;
        const toMinutes = Math.round(difference / 1000 / 60 / 60);
        if (toMinutes <= 30) {
          const validated = updateLastConnection(userId);
          if (validated) {
            res.send({ validated, connected: true });
          } else {
            res.send({ validated, connected: false });
          }
        } else {
          res.send({ connected: false });
        }
      })
      .catch(e => {
        console.error(e.stack);
      });
  }
};

export { updateLastConnection, disconnect, checkConnection };
