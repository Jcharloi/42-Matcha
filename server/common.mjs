import client from "./sql/sql.mjs";
import opencage from "opencage-api-client";
import nodemailer from "nodemailer";
import keys from "./keys.json";
import geodist from "geodist";

const { mail_password, odg_api_key } = keys;

const getUserCoordinatesByCity = async city => {
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
};

const getUserCityByCoordinates = async (lat, lon) => {
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
};

const sendMail = async (userInfo, subject, text) => {
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
};

const getUserId = async userName => {
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
};

const createRandomId = length => {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

const getMonthFromString = mon => {
  var d = Date.parse(mon + "2, 2019");
  if (!isNaN(d)) {
    return new Date(d).getMonth() + 1;
  }
  return -1;
};

const calculateAge = birthday => {
  var day = birthday.split("/")[1];
  var month = getMonthFromString(birthday.split("/")[0]);
  var year = birthday.split("/")[2];
  var dob = new Date(+year, +month - 1, +day);
  var diff_ms = Date.now() - dob.getTime();
  var age_dt = new Date(diff_ms);
  return Math.abs(age_dt.getUTCFullYear() - 1970);
};

const compareTag = (myTags, tagUser) => {
  return (
    myTags.findIndex(myTag => {
      return myTag === tagUser;
    }) != -1
  );
};

const calculateDistance = (myCoordinates, userMatchInfo) => {
  userMatchInfo.map(user => {
    const potentialMatchCoordinates = {
      lat: user.latitude,
      lon: user.longitude
    };
    user.distance = geodist(myCoordinates, potentialMatchCoordinates, {
      unit: "km"
    });
    if (user.distance < 100) {
      user.scoreDistance = 10;
    } else if (user.distance < 200) {
      user.scoreDistance = 5;
    } else {
      user.scoreDistance = 0;
    }
    return user;
  });
  return userMatchInfo;
};

const filterByBlocked = async (userMatchInfo, blockingUserId) => {
  userMatchInfo.forEach(async ({ user_id }, index) => {
    let text = `SELECT count(*) FROM user_block WHERE blocking_user_id = '${blockingUserId}' AND blocked_user_id = '${user_id}'`;
    await client
      .query(text)
      .then(({ rows: [{ count }] }) => {
        if (count === "1") userMatchInfo.splice(index, 1);
      })
      .catch(e => {
        console.error(e);
      });
  });
  return userMatchInfo;
};

export {
  getUserCoordinatesByCity,
  getUserCityByCoordinates,
  sendMail,
  getUserId,
  createRandomId,
  calculateAge,
  compareTag,
  calculateDistance,
  filterByBlocked
};
