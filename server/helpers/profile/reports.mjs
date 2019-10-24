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
  getUserTags,
  getUserName
} from "../profile/getUserInfos.mjs";

const getReportingUsers = async reported_user_id => {
  let text = `SELECT reporting_user_id FROM user_report WHERE reported_user_id = $1`;
  let values = [reported_user_id];
  let reportArray = [];
  return await client
    .query(text, values)
    .then(async ({ rowCount, rows }) => {
      let i = 0;
      console.log(reported_user_id);
      while (i < rows.length) {
        reportArray[i] = await getUserName(rows[i].reporting_user_id);
        i++;
      }
      return reportArray;
    })
    .catch(e => {
      return { validated: false };
    });
};

const getReports = async (req, res) => {
  const user = req.body.userName;
  if (user === "IAmAnAdmin") {
    // let text = `SELECT user_name FROM users JOIN user_report ON reporting_user_id = users.user_id
    // OR reported_user_id = users.user_id`;
    let text = `SELECT DISTINCT reported_user_id FROM user_report`;
    let reportArray = [];
    await client
      .query(text)
      .then(async ({ rowCount, rows }) => {
        console.log(rows);
        let i = 0;
        while (i < rows.length) {
          reportArray[i] = {
            reported_user: await getUserName(rows[i].reported_user_id),
            reporting_users: await getReportingUsers(rows[i].reported_user_id)
          };
          i++;
        }

        res.send({
          validated: true,
          reportArray
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
