import express from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import cors from "cors";
import client from "./sql.mjs";

const app = express();
app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

async function getUserInfos() {
  return await client
    .query("SELECT * FROM users WHERE user_id = 'cjvyxcuq30000zzrh6ci11clr'")
    .then(({ rows }) => {
      const userInfos = {
        user_id: rows[0].user_id,
        mail: rows[0].mail,
        user_name: rows[0].user_name,
        last_name: rows[0].last_name,
        first_name: rows[0].first_name,
        birthday: rows[0].birthday,
        gender: rows[0].gender,
        orientation: rows[0].orientation,
        presentation: rows[0].presentation,
        score: rows[0].score,
        city: rows[0].city
      };
      return userInfos;
    });
}

async function getUserPictures() {
  return await client
    .query(
      "SELECT path, date, main FROM profile_picture INNER JOIN users ON(profile_picture.user_id = users.user_id) WHERE users.user_id = 'cjvyxcuq30000zzrh6ci11clr' ORDER BY date DESC"
    )
    .then(({ rows, rowCount }) => {
      let userPictures = [];
      for (let i = 0; i < rowCount; i++) {
        userPictures.push({
          path: rows[i].path,
          date: rows[i].date,
          main: rows[i].main
        });
      }
      return userPictures;
    });
}

async function getUserTags() {
  return await client
    .query(
      "SELECT tag.tag_id, name, custom FROM tag JOIN user_tag ON(user_tag.tag_id = tag.tag_id) WHERE user_tag.user_id = 'cjvyxcuq30000zzrh6ci11clr'"
    )
    .then(({ rows, rowCount }) => {
      let userTags = [];
      for (let i = 0; i < rowCount; i++) {
        userTags.push({
          tag_id: rows[i].tag_id,
          name: rows[i].name,
          custom: rows[i].custom
        });
      }
      return userTags;
    });
}

app.post("/get-user-profile", async (req, res) => {
  let userInfos = {};
  userInfos = await getUserInfos();
  userInfos.pictures = await getUserPictures();
  userInfos.tags = await getUserTags();
  res.send(userInfos);
});

app.listen(5000, function() {
  console.log("Example app listening on port 5000!");
});
