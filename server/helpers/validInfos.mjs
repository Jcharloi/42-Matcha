import bcrypt from "bcrypt";
import client from "../sql/sql.mjs";

function compareTag(tagsList, potentialUserTag) {
  Object.entries(tagsList).forEach(([key, { name }]) => {
    if (name === potentialUserTag) {
      delete tagsList[key];
    }
  });
  return tagsList;
}

function validFile(name, size, type) {
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

function validMail(mail) {
  let regex = new RegExp(
    /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
  );
  if (!mail || !regex.test(String(mail).toLowerCase())) {
    return false;
  }
  return true;
}

async function validCurrentPassword(userName, currentPassword) {
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

function validPassword(password) {
  let regex = new RegExp(
    /(?=^.{8,}$)((?!.*\s)(?=.*[A-Z])(?=.*[a-z]))((?=(.*\d){1,})|(?=(.*\W){1,}))^.*$/
  );
  if (!password || !regex.test(password)) {
    return false;
  }
  return true;
}

function validBirthday(day, monthBody, year) {
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

function validGender(gender) {
  if (gender === "Man" || gender === "Woman" || gender === "Other") {
    return true;
  }
  return false;
}

function validOrientation(orientation) {
  if (
    orientation === "Heterosexual" ||
    orientation === "Homosexual" ||
    orientation === "Bisexual"
  ) {
    return true;
  }
  return false;
}

export {
  compareTag,
  validFile,
  validMail,
  validCurrentPassword,
  validPassword,
  validBirthday,
  validGender,
  validOrientation
};
