import express from "express";
import bodyParser from "body-parser";
import fileUpload from "express-fileupload";
import morgan from "morgan";
import cors from "cors";
import router from "./router.mjs";
import http from "http";
import client from "./sql/sql.mjs";
import socketIO from "socket.io";

const app = express();
const portApp = process.env.PORT || 5000;
const portSocket = process.env.PORT || 5001;
const server = http.createServer(app);
const io = socketIO(server);
export let users = [];

app.use(cors());
app.use(morgan("dev"));

app.use(bodyParser.json({ limit: "10mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));

app.use(fileUpload());

app.use(async (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Methods", "PUT, POST, GET, OPTIONS");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

io.on("connection", socket => {
  users.push(socket);
  console.log("User connected");
  //send every message
  socket.on("Get data for messages", async ({ senderId, receiverId }) => {
    console.log("get data");
    let text = `SELECT message, message_id, date, sender_read, sender_id, receiver_read FROM chat WHERE (sender_id = $1 AND receiver_id = $2) OR (sender_id = $2 and receiver_id = $1) ORDER BY date ASC`;
    let values = [senderId, receiverId];
    await client
      .query(text, values)
      .then(({ rows, rowCount }) => {
        let messages = [];
        for (let i = 0; i < rowCount; i++) {
          messages.push({
            message: rows[i].message,
            messageId: rows[i].message_id,
            date: rows[i].date,
            senderId: rows[i].sender_id,
            receiverRead: rows[i].receiver_read,
            senderRead: rows[i].sender_read
          });
          io.sockets.emit("Get messages", messages);
        }
      })
      .catch(e => {
        console.error(e.stack);
      });
  });
});

app.use(router);
io.listen(portSocket, () =>
  console.log(`Socket listening on port ${portSocket}`)
);

app.listen(portApp, () => console.log(`App listening on port ${portApp}`));
