import client from "../../sql/sql.mjs";
import { getUserVisitsAndLikes } from "./visits.mjs";
import { getUserId } from "../../common.mjs";
import socketIO from "socket.io";
import { Socket } from "dgram";
import { ioConnection, clients } from "../../app.mjs";

const notify = async (req, res) => {
  const receiver_id = await getUserId(req.body.userToNotify);
  const sender_id = await getUserId(req.body.userName);
  if (!receiver_id || !sender_id) {
    return { validated: false };
  } else {
    let text = `SELECT last_connection FROM users WHERE user_id = $1`;
    let values = [receiver_id];
    await client
      .query(text, values)
      .then(async ({ rows }) => {
        if (rows[0].last_connection === "Just now") {
          ioConnection
            .to(clients[0].socketId)
            .emit("greeting", "Howdy, User 1!");
          console.log("sent to " + client[0]);
          console.log(clients);
        }
        console.log(rows[0].last_connection);
      })
      .catch(e => {
        console.error(e.stack);
      });
  }
};

export default notify;
