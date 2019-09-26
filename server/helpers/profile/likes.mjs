import { getUserId } from "../../common.mjs";
import client from "../../sql/sql.mjs";

const toggleLike = async body => {
  const liking_user_id = await getUserId(body.userName);
  const liked_user_id = await getUserId(body.targetUser);
  if (!liking_user_id || !liked_user_id) {
    return { validated: false };
  } else {
    let text = `SELECT * FROM user_like WHERE liking_user_id = $1 AND liked_user_id = $2`;
    let values = [liking_user_id, liked_user_id];
    return await client
      .query(text, values)
      .then(async ({ rowCount }) => {
        if (rowCount === 0) {
          let text = `INSERT INTO user_like (liking_user_id, liked_user_id) VALUES ($1, $2)`;
          let values = [liking_user_id, liked_user_id];
          return await client
            .query(text, values)
            .then(() => {
              console.log("jambon1");
              return {
                validated: true,
                message: "User liked successfully !"
              };
            })
            .catch(e => {
              console.error(e);
              console.log("jambon");
              return {
                validated: false
              };
            });
        } else {
          let text = `DELETE FROM user_like WHERE liking_user_id = $1 AND liked_user_id = $2`;
          let values = [liking_user_id, liked_user_id];
          return await client
            .query(text, values)
            .then(() => {
              console.log("jambon2");
              return {
                validated: true,
                message: "User unliked successfully !"
              };
            })
            .catch(e => {
              console.error(e);
              console.log("jambon");
              return {
                validated: false
              };
            });
        }
      })
      .catch(e => {
        console.error(e);
        console.log("jambon");
        return {
          validated: false
        };
      });
  }
};

const checkMatch = async (req, res) => {
  const self_user_id = await getUserId(req.body.userName);
  const target_user_id = await getUserId(req.body.targetUser);
  var selfLikedTarget = false;
  var targetLikedSelf = false;
  var matched = false;
  if (!self_user_id || !target_user_id) {
    res.send({ validated: false });
  } else {
    let ret = await toggleLike(req.body);
    if (ret.validated == false) return "Error";
    let text = `SELECT * FROM user_like WHERE liking_user_id = $1 AND liked_user_id = $2`;
    let values = [self_user_id, target_user_id];
    await client
      .query(text, values)
      .then(async ({ rowCount }) => {
        if (rowCount !== 0) {
          selfLikedTarget = true;
        }
      })
      .catch(e => {
        console.error(e);
        res.send({
          validated: false,
          message: "We got a problem with our database, please try again"
        });
      });
    text = `SELECT * FROM user_like WHERE liking_user_id = $1 AND liked_user_id = $2`;
    values = [target_user_id, self_user_id];
    await client
      .query(text, values)
      .then(async ({ rowCount }) => {
        if (rowCount !== 0) {
          targetLikedSelf = true;
        }
      })
      .catch(e => {
        console.error(e);
        res.send({
          validated: false,
          message: "We got a problem with our database, please try again"
        });
      });
    if (targetLikedSelf == true && selfLikedTarget == true) {
      matched = true;
    }
    res.send({
      selfLikedTarget,
      targetLikedSelf,
      matched
    });
  }
};
export { toggleLike, checkMatch };
