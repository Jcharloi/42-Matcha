import express from "express";
import bodyParser from "body-parser";
import fileUpload from "express-fileupload";
import morgan from "morgan";
import cors from "cors";
import router from "./router.mjs";
import http from "http";
import socketIO from "socket.io";
import client from "./sql/sql.mjs";

const app = express();
const portApp = process.env.PORT || 5000;
const portSocket = process.env.PORT || 5001;
const server = http.createServer(app);
const io = socketIO(server);

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
  console.log("User connected");
  socket.on("Get all messages", ({ receiverId }) => {
    let text = `SELECT user_name, last_connection, a.date, a.sender_id, a.sender_read, a.receiver_read, message, path FROM users JOIN chat a ON user_id = sender_id JOIN profile_picture ON users.user_id = profile_picture.user_id WHERE a.date = (SELECT MAX(b.date) FROM chat b WHERE receiver_id = '79d3f60b-b18c-441d-8bc9-62ee9ced14ac' AND b.sender_id = a.sender_id) AND main = TRUE GROUP BY user_name, last_connection, a.date, a.sender_id, a.sender_read, a.receiver_read, message, path ORDER BY a.date DESC`;
    let usersMessage = [];
    client
      .query(text)
      .then(({ rows, rowCount }) => {
        for (let i = 0; i < rowCount; i++) {
          usersMessage.push({
            senderId: rows[i].sender_id,
            senderName: rows[i].user_name,
            lastConnection: rows[i].last_connection,
            date: rows[i].date,
            message: rows[i].message,
            senderRead: rows[i].sender_read,
            receiverRead: rows[i].receiver_read,
            mainPicture: rows[i].path
          });
          console.log(usersMessage);
        }
        socket.emit("Receive all messages", usersMessage);
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
