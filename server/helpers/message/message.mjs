import client from "../../sql/sql.mjs";
import { createRandomId, getUserId, checkMutualLikes } from "../../common.mjs";
import { ioConnection, clients } from "../../app.mjs";

const getSenderInfos = async sender => {
  let text = `SELECT user_name, last_connection, path FROM users JOIN profile_picture ON users.user_id = profile_picture.user_id WHERE users.user_id = $1 AND main = true`;
  let values = [sender];
  return await client
    .query(text, values)
    .then(async ({ rows, rowCount }) => {
      if (rowCount > 0) {
        return {
          validatedRes: true,
          user: {
            senderName: rows[0].user_name,
            lastConnection: rows[0].last_connection,
            mainPicture: rows[0].path
          }
        };
      } else {
        return { validatedRes: false };
      }
    })
    .catch(e => {
      console.error(e.stack);
      return { validatedRes: false };
    });
};

const checkAndGetSender = async (req, res) => {
  const senderId = await getUserId(req.body.senderName);
  const userId = await getUserId(req.body.userName);
  if (!senderId) {
    res.send({ validated: false });
  } else {
    const { validatedRes, user } = await getSenderInfos(senderId);
    if (validatedRes) {
      user.id = senderId;
      const { validated } = await checkMutualLikes(senderId, userId);
      if (validated) {
        res.send({ validated: true, user });
      } else {
        res.send({ validated: false });
      }
    } else {
      res.send({ validated: false });
    }
  }
};

const checkAllMessages = async receiverId => {
  let text = `SELECT message, message_id, a.date, a.sender_id, a.receiver_id, a.sender_read, a.receiver_read
        FROM chat a 
        WHERE a.message_id IN (SELECT b.message_id FROM chat b WHERE (b.receiver_id = $1 OR b.sender_id = $1))
        AND a.date = (SELECT MAX(b.date) FROM chat b WHERE (b.receiver_id = a.receiver_id AND b.sender_id = a.sender_id) OR (sender_id = a.receiver_id AND b.receiver_id = a.sender_id)) ORDER BY a.date DESC`;
  let values = [receiverId];
  return await client
    .query(text, values)
    .then(async ({ rows, rowCount }) => {
      let usersMessage = [];
      let validated = true;
      for (let i = 0; i < rowCount; i++) {
        const { validatedRes, user } = await getSenderInfos(
          rows[i].sender_id === receiverId
            ? rows[i].receiver_id
            : rows[i].sender_id
        );
        if (validatedRes) {
          usersMessage.push({
            message: rows[i].message,
            messageId: rows[i].message_id,
            date: rows[i].date,
            senderId: rows[i].sender_id,
            receiverId: rows[i].receiver_id,
            senderRead: rows[i].sender_read,
            receiverRead: rows[i].receiver_read,
            ...user
          });
        } else {
          validated = false;
        }
      }
      return { validated, usersMessage };
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
      const userId = await getUserId(req.body.userName);
      const { validated, usersMessage } = await checkAllMessages(userId);
      if (validated) {
        console.log(clients);
        // ioConnection.sockets.connected["uEdsmaC7zfsMM6ZnAAAD"].emit(
        //   "New history",
        //   usersMessage
        // );
      }
      res.send({ validated: true });
    })
    .catch(e => {
      console.error(e.stack);
      res.send({ validated: false });
    });
};

export {
  checkAndGetSender,
  getAllMessages,
  readMessage,
  getMessagesPeople,
  sendNewMessage
};
