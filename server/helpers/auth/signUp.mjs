import cuid from "cuid";
import bcrypt from "bcrypt";
import client from "../../sql/sql.mjs";

import { sendMail, createRandomId } from "../../common.mjs";
import { validBirthday, validMail, validPassword } from "../validInfos.mjs";

const inscription = async (req, res) => {
  if (
    req.body.firstName &&
    req.body.lastName &&
    (req.body.userName && req.body.userName.length < 21) &&
    validBirthday(req.body.day, req.body.month, req.body.year) &&
    validMail(req.body.mail) &&
    validPassword(req.body.password)
  ) {
    const text = `SELECT * FROM users WHERE mail = $1 OR user_name = $2`;
    const values = [req.body.mail, req.body.userName];
    await client
      .query(text, values)
      .then(async ({ rowCount }) => {
        if (rowCount === 0) {
          const uniqueLinkId = createRandomId(10);
          const hashedPassword = bcrypt.hashSync(req.body.password, 10);
          const birthday =
            req.body.month.substring(0, 3) +
            "/" +
            req.body.day +
            "/" +
            req.body.year;
          const text =
            "INSERT INTO users(user_id, mail, user_name, last_name, first_name, birthday, password_hash, orientation, score, validated_account, last_connection, unique_link_id) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)";
          const values = [
            cuid(),
            req.body.mail,
            req.body.userName,
            req.body.lastName,
            req.body.firstName,
            birthday,
            hashedPassword,
            "Both",
            "0",
            false,
            Math.floor(Date.now()),
            uniqueLinkId
          ];
          await client
            .query(text, values)
            .then(async () => {
              const subject = `Welcome Matcher`;
              const text = `I've noticed that you wanna join our community ? Awesome ! I really appreciate that, you won't be disappointed, I promise. You just have to click on the link below, and here we go : <br/> http://localhost:5000/validate-account/${uniqueLinkId}<br/><br/> Hope I see you soon ! 🤓</div>`;
              const response = await sendMail(req.body, subject, text);
              response === "Ok"
                ? res.send({
                    validated: true,
                    message:
                      "Thank you, we sent you an email, please read it to validate your account !"
                  })
                : res.send({
                    validated: false,
                    message:
                      "We got a problem with the mail sender, please try again"
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
              "This user already exists, please change the user name or the email address"
          });
        }
      })
      .catch(e => {
        console.error(e.stack);
      });
  } else {
    res.send({
      validated: false,
      message: "You need to provide all the fields correctly"
    });
  }
};

const validateAccount = async (req, res) => {
  let text = "SELECT * FROM users WHERE unique_link_id = $1";
  let values = [req.params.id];
  await client
    .query(text, values)
    .then(async ({ rowCount }) => {
      if (rowCount === 1) {
        text =
          "UPDATE users SET unique_link_id = null, validated_account = true WHERE unique_link_id = $1";
        values = [req.params.id];
        await client
          .query(text, values)
          .then(() => {
            res.redirect("http://localhost:3000/sign-in?register=true");
          })
          .catch(error => console.error(error));
      } else {
        res.redirect("http://localhost:3000/sign-in?register=false");
      }
    })
    .catch(e => console.error(e.stack));
};

export { inscription, validateAccount };
