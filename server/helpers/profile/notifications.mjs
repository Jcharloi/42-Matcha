import client from "../../sql/sql.mjs";
import { getUserVisitsAndLikes } from "./visits.mjs";
import { getUserId, getSocketId } from "../../common.mjs";
import socketIO from "socket.io";
import { Socket } from "dgram";
import { ioConnection, clients } from "../../app.mjs";

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

export default notifyUser;
