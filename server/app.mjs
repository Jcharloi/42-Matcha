import express from "express";
import bodyParser from "body-parser";
import fileUpload from "express-fileupload";
import morgan from "morgan";
import cors from "cors";
import router from "./router.mjs";
import http from "http";
import socketIO from "socket.io";
import client from "./sql/sql.mjs";
import { getUserId } from "./common.mjs";

const app = express();
const portApp = process.env.PORT || 5000;
const portSocket = process.env.PORT || 5001;
const server = http.createServer(app);
const io = socketIO(server);
export let socketConnection = [];
export let ioConnection = "";

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

var clients = [];
io.on("connection", socket => {
  socket.on("send-userName", async username => {
    console.log("fdfdofASSSSSSSdoddfasakd" + username);
    await getUserId(username);
    socket.username = username;
    // users.push(socket.username);
    // console.log(socket.username);
    clients.push({ username: { socketId: socket.id } });
    console.log(clients);
  });
  socketConnection.push(socket);
  ioConnection = io;
  console.log("User connected");
  // clients.push(socket.id);
});
setInterval(() => {
  let prev_rowCount = -1;
  let text = `SELECT * FROM notification WHERE receiver_id = $1`;
  let values = ["eef7d602-045f-4db3-92e2-afd6131f5a41"];
  if (clients[0]) io.to(clients[0]).emit("greeting", "Howdy, User 1!");
  if (clients[1]) io.to(clients[1]).emit("greeting", "Hey there, User 2");
  if (clients[2]) io.to(clients[2]).emit("greeting", "Hey there, User 3");

  client
    .query(text, values)
    .then(async ({ rowCount, rows }) => {
      if (rowCount > prev_rowCount && prev_rowCount != -1) {
        socket.emit("new_notification");
        console.log("notification emited");
      }
      prev_rowCount = rowCount;
      // console.log(clients);
    })
    .catch(e => {
      console.error(e.stack);
    });
}, 5000);

app.use(router);
io.listen(portSocket, () =>
  console.log(`Socket listening on port ${portSocket}`)
);

app.listen(portApp, () => console.log(`App listening on port ${portApp}`));
