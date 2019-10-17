import client from "../../sql/sql.mjs";
import { getUserVisitsAndLikes } from "./visits.mjs";
import { getUserId, getSocketId } from "../../common.mjs";
import socketIO from "socket.io";
import { Socket } from "dgram";
import { ioConnection, clients } from "../../app.mjs";

const notify = async (req, res) => {
  const receiver_id = await getUserId(req.body.userToNotify);
  const sender_id = await getUserId(req.body.userName);
  const notif_type = req.body.type;
  const notif_sender = req.body.userName;
  if (!receiver_id || !sender_id) {
    return { validated: false };
  } else {
    let text = `SELECT last_connection FROM users WHERE user_id = $1`;
    let values = [receiver_id];
    console.log;
    await client
      .query(text, values)
      .then(async ({ rows }) => {
        if (rows[0].last_connection === "now") {
          ioConnection
            .to(getSocketId(clients, req.body.userToNotify))
            .emit("notification", { type: notif_type, sender: notif_sender });
          console.log("sent to " + getSocketId(clients, req.body.userToNotify));
          console.log(clients);
          let newDate = new Date();
          values = [
            receiver_id,
            sender_id,
            toString(newDate),
            req.body.type,
            true
          ];
        } else {
          let newDate = new Date();
          values = [
            receiver_id,
            sender_id,
            toString(newDate),
            req.body.type,
            false
          ];
        }
        text = `INSERT INTO notification (receiver_id, sender_id, date, notif_type, seen) VALUES ($1, $2, $3, $4, $5)`;
        await client
          .query(text, values)
          .then(() => {
            res.send({
              validated: true
            });
          })
          .catch(e => {
            console.error(e.stack);
            res.send({ validated: false });
          });
      })
      .catch(e => {
        console.error(e.stack);
      });
  }
};

export default notify;
