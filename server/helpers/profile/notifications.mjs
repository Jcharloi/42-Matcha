import client from "../../sql/sql.mjs";
import { getUserVisitsAndLikes } from "./visits.mjs";
import { getUserId, getSocketId } from "../../common.mjs";
import socketIO from "socket.io";
import { Socket } from "dgram";
import { ioConnection, clients } from "../../app.mjs";
import { getUserName, getUserMainPic } from "./getUserInfos.mjs";

const notifyUser = async (userName, userTonotifyUser, type) => {
  const receiver_id = await getUserId(userTonotifyUser);
  const sender_id = await getUserId(userName);
  const notif_type = type;
  const notif_sender = userName;

  if (!receiver_id || !sender_id) {
    return { validated: false };
  } else {
    let text = `SELECT last_connection FROM users WHERE user_id = $1`;
    let values = [receiver_id];
    await client
      .query(text, values)
      .then(async ({ rows: [{ last_connection }] }) => {
        const difference = Math.floor(Date.now()) - last_connection;
        const toMinutes = Math.round(difference / 1000 / 60);
        if (toMinutes <= 1) {
          ioConnection
            .to(getSocketId(clients, userTonotifyUser))
            .emit("notification", { type: notif_type, sender: notif_sender });
        }
        text = `SELECT count(*) FROM notification WHERE receiver_id = $1 AND sender_id = $2 AND notif_type = $3 AND seen = $4`;
        values = [receiver_id, sender_id, type, toMinutes <= 1 ? true : false];
        // console.log("here");
        await client
          .query(text, values)
          .then(async ({ rows: [{ count }] }) => {
            let connectionDate = Math.floor(Date.now());
            text =
              count === "0"
                ? `INSERT INTO notification (receiver_id, sender_id, date, notif_type, seen) VALUES ($1, $2, ${connectionDate}, $3, $4)`
                : `UPDATE notification SET date = '${connectionDate}' WHERE receiver_id = $1 AND sender_id = $2 AND notif_type = $3 AND seen = $4`;
            await client
              .query(text, values)
              .then(() => {
                return {
                  validated: true
                };
              })
              .catch(e => {
                console.error(e.stack);
                return { validated: false };
              });
          })
          .catch(e => {
            console.error(e.stack);
            return { validated: false };
          });
      })
      .catch(e => {
        console.error(e.stack);
        return { validated: false };
      });
  }
};

const getNotification = async (req, res) => {
  const user_id = await getUserId(req.body.userName);
  if (!user_id) {
    res.send({ validated: false });
  } else {
    let text = `SELECT sender_id, notification.date, notif_type, seen, path from notification JOIN profile_picture ON sender_id = user_id WHERE receiver_id = $1 AND main = true ORDER BY seen ASC`;
    let values = [user_id];
    let notificationArray = [];
    await client
      .query(text, values)
      .then(async ({ rows }) => {
        let i = 0;
        while (i < rows.length) {
          notificationArray.push({
            sender: await getUserName(rows[i].sender_id),
            date: rows[i].date,
            notif_type: rows[i].notif_type,
            seen: rows[i].seen,
            mainPicPath: rows[i].path
          });
          i++;
        }
        res.send({
          validated: true,
          notificationArray
        });
      })
      .catch(e => {
        console.error(e.stack);
        res.send({
          validated: false
        });
      });
  }
};

const sawNotification = async (req, res) => {
  const user_id = await getUserId(req.body.userName);
  const sender_id = await getUserId(req.body.sender);
  const date = req.body.date;
  const notif_type = req.body.notif_type;

  if (!user_id) {
    res.send({ validated: false });
  } else {
    let text = `UPDATE notification SET seen = true WHERE receiver_id=$1 AND sender_id=$2 AND date=$3 AND notif_type=$4`;
    let values = [user_id, sender_id, date, notif_type];
    console.log(text);
    console.log(user_id, sender_id, date, notif_type);
    await client
      .query(text, values)
      .then(async () => {
        res.send({ validated: true });
      })
      .catch(e => {
        console.error(e.stack);
        res.send({ validated: false });
      });
  }
};

export { notifyUser, getNotification, sawNotification };
