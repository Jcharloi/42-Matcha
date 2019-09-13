import bcrypt from "bcrypt";
import client from "../../sql/sql.mjs";

import { sendMail, createRandomId } from "../../common.mjs";
import { validMail, validPassword } from "../validInfos.mjs";

const resetPassword = async (req, res) => {
  if (validMail(req.body.mail)) {
    const text = `SELECT user_name, validated_account FROM users WHERE mail = $1`;
    const values = [req.body.mail];
    await client
      .query(text, values)
      .then(async ({ rowCount, rows }) => {
        if (rowCount === 1 && rows[0].validated_account === true) {
          const uniqueLinkId = createRandomId(10);
          const text = `UPDATE users SET unique_link_id = '${uniqueLinkId}' WHERE mail = $1`;
          const values = [req.body.mail];
          await client
            .query(text, values)
            .then(async () => {
              const subject = `Password forgotten`;
              const text = `Seems like you forgot your password ? Don't worry about it, you just have to click on the link below to reset it : <br/> http://localhost:5000/reset-password/${uniqueLinkId}<br/><br/> See you soon ! 😊</div>`;
              const userInfo = {
                mail: req.body.mail,
                userName: rows[0].user_name
              };
              const response = await sendMail(userInfo, subject, text);
              response === "Ok"
                ? res.send({
                    validated: true,
                    message:
                      "Thank you, we sent you an email to reset your password, please check it out !"
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

            message: "Your account does not exists or is not validated"
          });
        }
      })
      .catch(e => console.error(e.stack));
  } else {
    res.send({
      validated: false,
      message: "You need to provide your email address correctly"
    });
  }
};

const resetPasswordId = async (req, res) => {
  let text = "SELECT * FROM users WHERE unique_link_id = $1";
  let values = [req.params.id];
  await client
    .query(text, values)
    .then(async ({ rowCount }) => {
      if (rowCount === 1) {
        res.redirect(
          `http://localhost:3000/reset-password?reset=${req.params.id}`
        );
      } else {
        res.redirect("http://localhost:3000/reset-password?reset=false");
      }
    })
    .catch(e => console.error(e.stack));
};

const newPassword = async (req, res) => {
  if (validPassword(req.body.password)) {
    let text = "SELECT validated_account FROM users WHERE unique_link_id = $1";
    let values = [req.body.uniqueId];
    await client
      .query(text, values)
      .then(async ({ rowCount, rows }) => {
        if (rowCount === 1 && rows[0].validated_account) {
          let hashedPassword = bcrypt.hashSync(req.body.password, 10);
          text = `UPDATE users SET password_hash='${hashedPassword}', unique_link_id = null WHERE unique_link_id = $1`;
          values = [req.body.uniqueId];
          await client
            .query(text, values)
            .then(() => {
              res.send({
                redirect: true,
                message:
                  "Nice, you updated your password successfully ! You will be redirected to the sign in page in 3 seconds"
              });
            })
            .catch(e => {
              console.error(e.stack);
              res.send({
                redirect: false,
                message: "There was a problem with our database"
              });
            });
        } else {
          res.send({
            redirect: false,
            message:
              "This link id is not valid anymore or your account is not validated"
          });
        }
      })
      .catch(e => {
        console.error(e.stack);
        res.send({
          redirect: false,
          message: "There was a problem with our database"
        });
      });
  } else {
    res.send({
      redirect: false,
      message: "You need to provide your password correctly"
    });
  }
};

export { resetPassword, resetPasswordId, newPassword };
