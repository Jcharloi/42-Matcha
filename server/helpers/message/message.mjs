import client from "../../sql/sql.mjs";
import { createRandomId } from "../../common.mjs";
import { users } from "../../app.mjs";

const getAllMessages = async (req, res) => {
  let text = `SELECT user_name, last_connection, a.date, a.sender_id, a.receiver_id, a.sender_read, a.receiver_read, message, message_id, path FROM users JOIN chat a ON user_id = sender_id JOIN profile_picture ON users.user_id = profile_picture.user_id WHERE a.date = (SELECT MAX(b.date) FROM chat b WHERE receiver_id = $1 AND b.sender_id = a.sender_id) AND main = TRUE GROUP BY user_name, last_connection, a.date, a.sender_id, a.receiver_id, a.sender_read, a.receiver_read, message, message_id, path ORDER BY a.date DESC`;
  let values = [req.body.receiverId];
  await client
    .query(text, values)
    .then(({ rows, rowCount }) => {
      let usersMessage = [];
      for (let i = 0; i < rowCount; i++) {
        usersMessage.push({
          senderId: rows[i].sender_id,
          senderName: rows[i].user_name,
          receiverId: rows[i].receiver_id,
          lastConnection: rows[i].last_connection,
          date: rows[i].date,
          message: rows[i].message,
          messageId: rows[i].message_id,
          senderRead: rows[i].sender_read,
          receiverRead: rows[i].receiver_read,
          mainPicture: rows[i].path
        });
      }
      res.send({ validated: true, usersMessage });
    })
    .catch(e => {
      console.error(e.stack);
      res.send({ validated: false });
    });
};

const readMessage = async (req, res) => {
  let text = `UPDATE chat SET receiver_read = TRUE WHERE sender_id = $1 AND receiver_id = $2 AND message_id = $3`;
  let values = [req.body.senderId, req.body.receiverId, req.body.messageId];
  await client
    .query(text, values)
    .then(() => {
      res.send({ validated: true });
    })
    .catch(e => {
      console.error(e.stack);
      res.send({ validated: false });
    });
};

const sendNewMessage = async (req, res) => {
  console.log(users.length);
  let text = `INSERT INTO chat (sender_id, receiver_id, date, message, message_id, sender_read, receiver_read) VALUES ($1, $2, ${Math.floor(
    Date.now() / 1000
  )}, $3, '${createRandomId(5)}', TRUE, FALSE)`;
  let values = [req.body.receiverId, req.body.senderId, req.body.message];
  await client
    .query(text, values)
    .then(() => {
      res.send({ validated: true });
    })
    .catch(e => {
      console.error(e.stack);
      res.send({ validated: false });
    });
};

export { getAllMessages, readMessage, sendNewMessage };
