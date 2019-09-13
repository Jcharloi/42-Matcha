import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import client from "../../sql/sql.mjs";
import keys from "../../keys.json";
const { secret } = keys;

import { validPassword } from "../validInfos.mjs";
import {
  getUserInfos,
  getUserPictures,
  getUserTags
} from "../profile/getUserInfos.mjs";

const connection = async (req, res) => {
  if (req.body.userName && validPassword(req.body.password)) {
    const text = `SELECT user_id, validated_account, password_hash FROM users WHERE user_name = $1`;
    const values = [req.body.userName];
    await client
      .query(text, values)
      .then(async ({ rowCount, rows }) => {
        if (rowCount === 1 && rows[0].validated_account === true) {
          const userId = rows[0].user_id;
          await bcrypt
            .compare(req.body.password, rows[0].password_hash)
            .then(async response => {
              if (response) {
                const token = jwt.sign(
                  { userName: req.body.userName },
                  secret,
                  { expiresIn: "24h" }
                );
                let userInfos = {};
                userInfos = await getUserInfos(userId);
                userInfos.pictures = await getUserPictures(userId);
                userInfos.tags = await getUserTags(userId);
                res.json({
                  userInfos,
                  message: "Connected",
                  token: token
                });
              } else {
                res.send({ message: "Wrong password" });
              }
            })
            .catch(e => {
              console.error(e.stack);
              res.send({ message: "There was a problem with our bcrypt" });
            });
        } else {
          res.send({
            message: "Your account does not exists or is not validated"
          });
        }
      })
      .catch(e => {
        console.error(e.stack);
        res.send({ message: "There was a problem with our database" });
      });
  } else {
    res.send({ message: "You need to provide all the fields correctly" });
  }
};

export { connection };
