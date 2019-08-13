import client from "./sql/sql.mjs";

import nodemailer from "nodemailer";
import keys from "./keys.json";
const { mail_password } = keys;

async function sendMail(userInfo, subject, text) {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "matcha.gestion@gmail.com",
      pass: mail_password
    }
  });
  const response = await transporter
    .sendMail({
      from: '"Matcha\'s team" <matcha.gestion@gmail.com>',
      to: `${userInfo.userName}, ${userInfo.mail}`,
      subject: `${subject} 💕`,
      html: `<div>Hello ${userInfo.userName} 👋<br/><br/> ${text}`
    })
    .then(() => {
      return "Ok";
    })
    .catch(error => {
      console.error(error);
      return "Fail";
    });
  return response;
}

async function getUserId(userName) {
  let text = `SELECT user_id FROM users WHERE user_name = $1`;
  let values = [userName];
  return await client
    .query(text, values)
    .then(({ rowCount, rows }) => {
      if (rowCount === 1) {
        return rows[0].user_id;
      } else {
        return false;
      }
    })
    .catch(e => {
      console.error(e);
      return false;
    });
}

function createRandomId(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export { sendMail, getUserId, createRandomId };
