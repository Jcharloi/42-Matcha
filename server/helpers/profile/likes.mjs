import { getUserId } from "../../common.mjs";
import client from "../../sql/sql.mjs";

const toggleLike = async (req, res) => {
  const liking_user_id = await getUserId(req.body.userName);
  const liked_user_id = await getUserId(req.body.liked_user);
  if (!liking_user_id || !liked_user_id) {
    res.send({ validated: false });
  } else {
    let text = `SELECT * FROM user_like WHERE liking_user_id = $1 AND liked_user_id = $2`;
    let values = [liking_user_id, liked_user_id];
    await client
      .query(text, values)
      .then(async ({ rowCount }) => {
        if (rowCount === 0) {
          let text = `INSERT INTO user_like (liking_user_id, liked_user_id) VALUES ($1, $2)`;
          let values = [liking_user_id, liked_user_id];
          await client
            .query(text, values)
            .then(() => {
              res.send({
                message: "User liked successfully !"
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
          let text = `DELETE FROM user_like WHERE liking_user_id = $1 AND liked_user_id = $2`;
          let values = [liking_user_id, liked_user_id];
          await client
            .query(text, values)
            .then(() => {
              res.send({
                message: "User unliked successfully !"
              });
            })
            .catch(e => {
              console.error(e);
              res.send({
                validated: false,
                message: "We got a problem with our database, please try again"
              });
            });
        }
      })
      .catch(e => {
        console.error(e);
        res.send({
          validated: false,
          message: "We got a problem with our database, please try again"
        });
      });
  }
};

export { toggleLike };
