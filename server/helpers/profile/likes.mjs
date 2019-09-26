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
              return {
                validated: true,
                message: "User liked successfully !"
              };
            })
            .catch(e => {
              console.error(e);
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
              return {
                validated: true,
                message: "User unliked successfully !"
              };
            })
            .catch(e => {
              console.error(e);
              return {
                validated: false
              };
            });
        }
      })
      .catch(e => {
        console.error(e);
        return {
          validated: false
        };
      });
  }
};

const checkLiked = async (liking, liked) => {
  let text = `SELECT * FROM user_like WHERE liking_user_id = $1 AND liked_user_id = $2`;
  let values = [liking, liked];
  return await client
    .query(text, values)
    .then(async ({ rowCount }) => {
      if (rowCount !== 0) {
        return true;
      }
      return false;
    })
    .catch(e => {
      console.error(e);
      return {
        validated: false,
        message: "We got a problem with our database, please try again"
      };
    });
};

const checkMatch = async (self, target) => {
  const selfLikedTarget = await checkLiked(self, target);
  const targetLikedSelf = await checkLiked(target, self);
  let matched = false;
  if (selfLikedTarget.validated || targetLikedSelf.validated) {
    return false;
  } else {
    if (targetLikedSelf == true && selfLikedTarget == true) {
      matched = true;
    }
    return { selfLikedTarget, targetLikedSelf, matched };
  }
};

const checkLikeAndMatch = async (req, res) => {
  const self_user_id = await getUserId(req.body.userName);
  const target_user_id = await getUserId(req.body.targetUser);
  if (!self_user_id || !target_user_id) {
    res.send({ validated: false });
  } else {
    let error = false;
    if (req.body.toggle) {
      let { validated } = await toggleLike(req.body);
      if (validated == false) {
        error = true;
        res.send({
          validated: false,
          message: "We got a problem with our liking function, please try again"
        });
      } else {
        res.send(await checkMatch(self_user_id, target_user_id));
      }
    } else if (error === false) {
      res.send(await checkMatch(self_user_id, target_user_id));
    }
  }
};
export { toggleLike, checkLikeAndMatch };
