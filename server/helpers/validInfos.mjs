import bcrypt from "bcrypt";
import client from "../sql/sql.mjs";
import fileType from "file-type";

const compareTag = (tagsList, potentialUserTag) => {
  tagsList.map((tag, index) => {
    if (tag.name === potentialUserTag) {
      tagsList.splice(index, 1);
    }
  });
  return tagsList;
};

const validFile = (name, size, data, type) => {
  let ab = new ArrayBuffer(data.length);
  let view = new Uint8Array(ab);
  for (var i = 0; i < data.length; ++i) {
    view[i] = data[i];
  }
  const fileRes = fileType(ab);
  if (!name || !fileRes) {
    return false;
  }
  if (
    !type ||
    (type !== "image/png" && type !== "image/jpeg" && type !== "image/jpg") ||
    (fileRes.ext !== "png" && fileRes.ext !== "jpeg" && fileRes.ext !== "jpg")
  ) {
    return false;
  }
  if (!size || size > 1000000) {
    return false;
  }
  return true;
};

const validMail = mail => {
  let regex = new RegExp(
    /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
  );
  if (!mail || !regex.test(String(mail).toLowerCase())) {
    return false;
  }
  return true;
};

const checkMailAlreadyExisted = async (mail, userName) => {
  let text = `SELECT user_name FROM users WHERE mail = $1`;
  let values = [mail];
  return await client
    .query(text, values)
    .then(({ rows }) => {
      if (rows.length === 0 || rows[0].user_name === userName) {
        return true;
      }
      return false;
    })
    .catch(e => {
      console.error(e.stack);
      return false;
    });
};

const validCurrentPassword = async (userName, currentPassword) => {
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
};

const validPassword = password => {
  let regex = new RegExp(
    /(?=^.{8,}$)((?!.*\s)(?=.*[A-Z])(?=.*[a-z]))((?=(.*\d){1,})|(?=(.*\W){1,}))^.*$/
  );
  if (!password || !regex.test(password)) {
    return false;
  }
  return true;
};

const validBirthday = (day, monthBody, year) => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
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
};

const validGender = gender => {
  if (gender === "Man" || gender === "Woman" || gender === "Other") {
    return true;
  }
  return false;
};

const validOrientation = orientation => {
  if (
    orientation === "Man" ||
    orientation === "Woman" ||
    orientation === "Other" ||
    orientation === "Both"
  ) {
    return true;
  }
  return false;
};

const validIntervalParam = (start, end, startNb, endNb) => {
  if (start >= startNb && start <= endNb && end >= startNb && end <= endNb) {
    return true;
  }
  return false;
};

export {
  compareTag,
  validFile,
  validMail,
  checkMailAlreadyExisted,
  validCurrentPassword,
  validPassword,
  validBirthday,
  validGender,
  validOrientation,
  validIntervalParam
};
