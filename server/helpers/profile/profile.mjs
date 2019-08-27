import bcrypt from "bcrypt";

import {
  validCurrentPassword,
  validPassword,
  validMail,
  validBirthday,
  validGender,
  validOrientation
} from "../validInfos.mjs";

import client from "../../sql/sql.mjs";

const changePersonalInfos = async (req, res) => {
  if (
    req.body.firstName &&
    req.body.lastName &&
    req.body.city &&
    validMail(req.body.mail) &&
    validBirthday(req.body.day, req.body.month, req.body.year)
  ) {
    const birthday = req.body.month + "/" + req.body.day + "/" + req.body.year;
    let text = `UPDATE users SET first_name=$1, last_name=$2, mail=$3, city=$4, birthday=$5 WHERE user_name = $6`;
    let values = [
      req.body.firstName,
      req.body.lastName,
      req.body.mail,
      req.body.city,
      birthday,
      req.body.userName
    ];
    await client
      .query(text, values)
      .then(() => {
        res.send({
          validated: true,
          message: "Personal informations updated successfully !"
        });
      })
      .catch(e => {
        console.error(e.stack);
        res.send({
          validated: false,
          message: "There was a problem with our database"
        });
      });
  } else {
    res.send({
      validated: false,
      message: "You need to provide all the fields correctly"
    });
  }
};

const changePreferenceInfos = async (req, res) => {
  if (
    req.body.bio &&
    validGender(req.body.gender) &&
    validOrientation(req.body.orientation)
  ) {
    let text = `UPDATE users SET gender=$1, orientation=$2, presentation=$3 WHERE user_name = $4`;
    let values = [
      req.body.gender,
      req.body.orientation,
      req.body.bio,
      req.body.userName
    ];
    await client
      .query(text, values)
      .then(() => {
        res.send({
          validated: true,
          message: "You updated your preferences successfully !"
        });
      })
      .catch(e => {
        console.error(e.stack);
        res.send({
          validated: false,
          message: "There was a problem with our database"
        });
      });
  } else {
    res.send({
      validated: false,
      message: "You need to provide all the fields correctly"
    });
  }
};

const changePassword = async (req, res) => {
  if (
    validPassword(req.body.newPassword) &&
    (await validCurrentPassword(req.body.userName, req.body.currentPassword))
  ) {
    let hashedPassword = bcrypt.hashSync(req.body.newPassword, 10);
    let text = `UPDATE users SET password_hash='${hashedPassword}' WHERE user_name = $1`;
    let values = [req.body.userName];
    await client
      .query(text, values)
      .then(() => {
        res.send({
          validated: true,
          message: "You updated your password successfully !"
        });
      })
      .catch(e => {
        console.error(e.stack);
        res.send({
          validated: false,
          message: "There was a problem with our database"
        });
      });
  } else {
    res.send({
      validated: false,
      message:
        "Your current password does not match or you wrote your new password incorrectly"
    });
  }
};

export default {
  changePersonalInfos,
  changePreferenceInfos,
  changePassword
};
