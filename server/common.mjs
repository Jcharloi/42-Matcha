import client from "./sql/sql.mjs";
import opencage from "opencage-api-client";
import nodemailer from "nodemailer";
import keys from "./keys.json";

const { mail_password, odg_api_key } = keys;

async function getUserCoordinatesByCity(city) {
  return await opencage
    .geocode({
      q: `${city}`,
      key: odg_api_key
    })
    .then(data => {
      let coordinates = {};
      if (data.status.code == 200 && data.results.length > 0) {
        coordinates.lat = data.results[0].geometry.lat;
        coordinates.lon = data.results[0].geometry.lng;
      }
      return coordinates;
    })
    .catch(e => {
      console.error(e.stack);
    });
}

async function getUserCityByCoordinates(lat, lon) {
  return await opencage
    .geocode({
      q: `${lat}, ${lon}`,
      key: odg_api_key
    })
    .then(data => {
      let city;
      if (data.status.code == 200 && data.results.length > 0) {
        city = data.results[0].components.city;
      }
      return city;
    })
    .catch(e => {
      console.error(e.stack);
    });
}

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

export {
  getUserCoordinatesByCity,
  getUserCityByCoordinates,
  sendMail,
  getUserId,
  createRandomId
};
