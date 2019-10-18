import client from "../../sql/sql.mjs";
import { getUserVisitsAndLikes } from "./visits.mjs";
import { getUserId, getSocketId } from "../../common.mjs";
import socketIO from "socket.io";
import { Socket } from "dgram";
import { ioConnection, clients } from "../../app.mjs";

const notify = async (userName, userToNotify, type) => {
  const receiver_id = await getUserId(userToNotify);
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
      .then(async ({ rows }) => {
        if (rows[0].last_connection === "now") {
          ioConnection
            .to(getSocketId(clients, userToNotify))
            .emit("notification", { type: notif_type, sender: notif_sender });
          let newDate = Math.floor(Date.now());
          values = [receiver_id, sender_id, newDate, type, true];
        } else {
          let newDate = Math.floor(Date.now());
          values = [receiver_id, sender_id, newDate, type, false];
        }
        text = `INSERT INTO notification (receiver_id, sender_id, date, notif_type, seen) VALUES ($1, $2, $3, $4, $5)`;
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
  }
};

export default notify;
