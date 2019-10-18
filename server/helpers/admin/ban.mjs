import client from "../../sql/sql.mjs";

const banUser = async (req, res) => {
  let text = "DELETE FROM users WHERE user_id = $1";
  let values = [req.body.targetUserId];
  await client
    .query(text, values)
    .then(async () => {
      let text = "DELETE FROM user_like WHERE liking_user_id = $1";
      let values = [req.body.targetUserId];
      await client
        .query(text, values)
        .then(async () => {
          let text =
            "DELETE FROM user_report WHERE reporting_user_id = $1 OR reported_user_id = $1";
          let values = [req.body.targetUserId];
          await client
            .query(text, values)
            .then(async () => {
              let text =
                "DELETE FROM user_like WHERE liking_user_id = $1 OR liked_user_id = $1";
              let values = [req.body.targetUserId];
              await client
                .query(text, values)
                .then(async () => {
                  let text = "DELETE FROM user_tag WHERE user_id = $1";
                  let values = [req.body.targetUserId];
                  await client
                    .query(text, values)
                    .then(async () => {
                      let text =
                        "DELETE FROM user_visit WHERE visiting_user_id = $1 OR visited_user_id = $1";
                      let values = [req.body.targetUserId];
                      await client
                        .query(text, values)
                        .then(() => {})
                        .catch(e => {
                          console.error(e);
                        });
                    })
                    .catch(e => {
                      console.error(e);
                    });
                })
                .catch(e => {
                  console.error(e);
                });
            })
            .catch(e => {
              console.error(e);
            });
        })
        .catch(e => {
          console.error(e);
        });
      res.send({ valdated: true });
    })
    .catch(e => {
      console.error(e);
      res.send({ validated: false });
    });
};

export { banUser };
