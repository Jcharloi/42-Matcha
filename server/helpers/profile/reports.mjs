import client from "../../sql/sql.mjs";
import {
  getUserId,
  calculateAge,
  calculateDistance,
  filterByBlockedUser,
  filterByIncompletedUser
} from "../../common.mjs";
import {
  getUserLatitudeAndLongitude,
  getUserPictures,
  getUserTags
} from "../profile/getUserInfos.mjs";

const getReports = async (req, res) => {
  const user = req.body.userName;
  if (user === "IAmAnAdmin") {
    let text = `SELECT * FROM user_report`;
    let reportArray = [];
    await client
      .query(text)
      .then(async ({ rowCount, rows }) => {
        rows.forEach(async function(row) {
          let text = `SELECT user_name FROM users WHERE user_id = row.reporting_user_id`;
          await client
            .query(text)
            .then(result => {
              row.reporting_user_id = result;
            })
            .catch(e => {
              console.error(e.stack);
            });
          text = `SELECT user_name FROM users WHERE user_id = row.reported_user_id`;
          await client
            .query(text)
            .then(result => {
              row.reported_user_id = result;
            })
            .catch(e => {
              console.error(e.stack);
            });

          // console.log(row.reporting_user_id);
        });
        res.send({
          validated: true,
          rows
        });
      })
      .catch(e => {
        console.error(e.stack);
        res.send({
          validated: false,
          message: "We got a problem with our database, please try again"
        });
      });
  } else
    res.send({
      validated: false,
      message: "You are not an admin fuck off pls"
    });
};

export default getReports;
