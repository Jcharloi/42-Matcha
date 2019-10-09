import express from "express";
import bodyParser from "body-parser";
import fileUpload from "express-fileupload";
import morgan from "morgan";
import cors from "cors";
import router from "./router.mjs";
import http from "http";
import socketIO from "socket.io";

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
  //send every message
});

app.use(router);
io.listen(portSocket, () =>
  console.log(`Socket listening on port ${portSocket}`)
);

app.listen(portApp, () => console.log(`App listening on port ${portApp}`));
