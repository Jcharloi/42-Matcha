import client from "../../sql/sql.mjs";
import { getUserId } from "../../common.mjs";

const deleteUser = async (req, res) => {
  const adminId = await getUserId("IAmAnAdmin");
  const userId = await getUserId(req.body.userName);
  const targetUserId = await getUserId(req.body.targetUserName);
  if ((userId === adminId || userId === targetUserId) && targetUserId) {
    let text = "DELETE FROM users WHERE user_id = $1";
    let values = [targetUserId];
    await client
      .query(text, values)
      .then(async () => {
        let text = "DELETE FROM chat WHERE sender_id = $1 OR receiver_id = $1";
        let values = [targetUserId];
        await client
          .query(text, values)
          .then(async () => {
            let text =
              "DELETE FROM user_report WHERE reporting_user_id = $1 OR reported_user_id = $1";
            let values = [targetUserId];
            await client
              .query(text, values)
              .then(async () => {
                let text =
                  "DELETE FROM user_like WHERE liking_user_id = $1 OR liked_user_id = $1";
                let values = [targetUserId];
                await client
                  .query(text, values)
                  .then(async () => {
                    let text = "DELETE FROM user_tag WHERE user_id = $1";
                    let values = [targetUserId];
                    await client
                      .query(text, values)
                      .then(async () => {
                        let text =
                          "DELETE FROM user_visit WHERE visiting_user_id = $1 OR visited_user_id = $1";
                        let values = [targetUserId];
                        await client
                          .query(text, values)
                          .then(() => {
                            res.send({ validated: true });
                          })
                          .catch(e => {
                            console.error(e);
                            res.send({
                              validated: false,
                              message:
                                "We got a problem with our database, please try again"
                            });
                          });
                      })
                      .catch(e => {
                        console.error(e);
                        res.send({
                          validated: false,
                          message:
                            "We got a problem with our database, please try again"
                        });
                      });
                  })
                  .catch(e => {
                    console.error(e);
                    res.send({
                      validated: false,
                      message:
                        "We got a problem with our database, please try again"
                    });
                  });
              })
              .catch(e => {
                console.error(e);
                res.send({
                  validated: false,
                  message:
                    "We got a problem with our database, please try again"
                });
              });
          })
          .catch(e => {
            console.error(e);
            res.send({
              validated: false,
              message: "We got a problem with our database, please try again"
            });
          });
      })
      .catch(e => {
        console.error(e);
        res.send({
          validated: false,
          message: "We got a problem with our database, please try again"
        });
      });
  } else {
    res.send({
      validated: false,
      message: "You can't delete an other account than yours"
    });
  }
};

export { deleteUser };
