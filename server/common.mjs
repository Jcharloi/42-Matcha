import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import keys from "./keys.json";
const { secret } = keys;

import client from "./sql.mjs";

export async function getUserId(userName) {
  let text = `SELECT user_id FROM users WHERE user_name = $1`;
  let values = [userName];
  const user_id = await client
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
  return user_id;
}

export function createRandomId(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export function compareTag(tagsList, potentialUserTag) {
  Object.entries(tagsList).forEach(([key, { name }]) => {
    if (name === potentialUserTag) {
      delete tagsList[key];
    }
  });
  return tagsList;
}

export function validFile(name, size, type) {
  if (!name) {
    return false;
  }
  if (
    !type ||
    (type !== "image/png" && type !== "image/jpeg" && type !== "image/jpg")
  ) {
    return false;
  }
  if (!size || size > 1000000) {
    return false;
  }
  return true;
}

export function validMail(mail) {
  let regex = new RegExp(
    /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
  );
  if (!mail || !regex.test(String(mail).toLowerCase())) {
    return false;
  }
  return true;
}

export async function validCurrentPassword(userName, currentPassword) {
  let answer;
  const text = `SELECT password_hash FROM users WHERE user_name = $1`;
  const values = [userName];
  await client
    .query(text, values)
    .then(async ({ rowCount, rows }) => {
      if (rowCount === 1) {
        await bcrypt
          .compare(currentPassword, rows[0].password_hash)
          .then(response => {
            answer = response;
          })
          .catch(e => {
            console.error(e.stack);
            answer = false;
          });
      } else {
        answer = false;
      }
    })
    .catch(e => {
      console.error(e.stack);
      anwer = false;
    });
  return answer;
}

export function validPassword(password) {
  let regex = new RegExp(
    /(?=^.{8,}$)((?!.*\s)(?=.*[A-Z])(?=.*[a-z]))((?=(.*\d){1,})|(?=(.*\W){1,}))^.*$/
  );
  if (!password || !regex.test(password)) {
    return false;
  }
  return true;
}

export function validBirthday(day, monthBody, year) {
  const months = [
    "January",
    "February",
    "Mars",
    "April",
    "Mai",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];
  if (!day || !monthBody || !year) {
    return false;
  }
  if (day < 1 || day > 31 || year < 1919 || year > 2001) {
    return false;
  }
  if (months.indexOf(monthBody) < 0) {
    return false;
  }
  return true;
}

export function validGender(gender) {
  if (gender === "Man" || gender === "Woman" || gender === "Other") {
    return true;
  }
  return false;
}

export function validOrientation(orientation) {
  if (
    orientation === "Heterosexual" ||
    orientation === "Homosexual" ||
    orientation === "Bisexual"
  ) {
    return true;
  }
  return false;
}

export async function checkAuthToken(token, userName) {
  if (!token || !userName) {
    return {
      validated: false,
      message: "Stop playing with our localStorage 😤"
    };
  }
  return await jwt.verify(token, secret, async (err, decoded) => {
    if (err) {
      return {
        validated: false,
        message: "Stop playing with our localStorage 😤"
      };
    } else {
      const text = `SELECT * FROM users WHERE user_name = $1`;
      const values = [userName];
      const response = await client
        .query(text, values)
        .then(async ({ rowCount }) => {
          if (rowCount === 1) {
            return {
              validated: true
            };
          }
          return {
            validated: false,
            message: "Stop playing with our localStorage 😤"
          };
        })
        .catch(e => {
          console.error(e);
          return {
            validated: false,
            message: "Stop playing with our localStorage 😤"
          };
        });
      return response;
    }
  });
}
