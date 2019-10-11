import client from "../../sql/sql.mjs";
import { createRandomId } from "../../common.mjs";
import { socketConnection, ioConnection } from "../../app.mjs";

const checkAllMessages = async receiverId => {
  let text = `SELECT user_name, last_connection, a.date, a.sender_id, a.receiver_id, a.sender_read, a.receiver_read, message, message_id, path FROM users JOIN chat a ON user_id = sender_id JOIN profile_picture ON users.user_id = profile_picture.user_id WHERE a.date = (SELECT MAX(b.date) FROM chat b WHERE receiver_id = $1 AND b.sender_id = a.sender_id) AND main = TRUE GROUP BY user_name, last_connection, a.date, a.sender_id, a.receiver_id, a.sender_read, a.receiver_read, message, message_id, path ORDER BY a.date DESC`;
  let values = [receiverId];
  return await client
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
      return { validated: true, usersMessage };
    })
    .catch(e => {
      console.error(e.stack);
      return { validated: false };
    });
};

const getAllMessages = async (req, res) => {
  const { validated, usersMessage } = await checkAllMessages(
    req.body.receiverId
  );
  if (validated) {
    res.send({ validated, usersMessage });
  } else {
    res.send({ validated });
  }
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

const getMessagesPeople = async (req, res) => {
  let text = `SELECT message, message_id, date, sender_read, sender_id, receiver_read FROM chat WHERE (sender_id = $1 AND receiver_id = $2) OR (sender_id = $2 and receiver_id = $1) ORDER BY date ASC`;
  let values = [req.body.senderId, req.body.receiverId];
  await client
    .query(text, values)
    .then(({ rows, rowCount }) => {
      let allMessages = [];
      for (let i = 0; i < rowCount; i++) {
        allMessages.push({
          message: rows[i].message,
          messageId: rows[i].message_id,
          date: rows[i].date,
          sentPosition: rows[i].sender_id,
          receiverRead: rows[i].receiver_read,
          senderRead: rows[i].sender_read
        });
      }
      res.send({ validated: true, allMessages });
    })
    .catch(e => {
      console.error(e.stack);
      res.send({ validated: false });
    });
};

const sendNewMessage = async (req, res) => {
  console.log(socketConnection.length);
  const messageId = createRandomId(10);
  const messageDate = Math.floor(Date.now() / 1000);
  let text = `INSERT INTO chat (sender_id, receiver_id, date, message, message_id, sender_read, receiver_read) VALUES ($1, $2, $3, $4, $5, TRUE, FALSE)`;
  let values = [
    req.body.receiverId,
    req.body.senderId,
    messageDate,
    req.body.message,
    messageId
  ];
  await client
    .query(text, values)
    .then(async () => {
      ioConnection.sockets.emit("New message", {
        message: req.body.message,
        messageId: messageId,
        date: messageDate,
        sentPosition: req.body.receiverId,
        receiverRead: false,
        senderRead: true
      });
      // const { validated, usersMessage } = await checkAllMessages(
      // req.body.senderId
      // );
      // if (validated) {
      // ioConnection.sockets.emit("New history", usersMessage);
      // }
      res.send({ validated: true });
    })
    .catch(e => {
      console.error(e.stack);
      res.send({ validated: false });
    });
};

export { getAllMessages, readMessage, getMessagesPeople, sendNewMessage };
