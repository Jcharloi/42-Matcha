import express from "express";
import bodyParser from "body-parser";
import fileUpload from "express-fileupload";
import morgan from "morgan";
import cors from "cors";

import router from "./router.mjs";

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(morgan("dev"));

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

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

app.use(router);
app.listen(port, () => console.log(`Listening on port ${port}`));
