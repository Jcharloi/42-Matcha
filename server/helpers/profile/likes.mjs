import {
  getUserId,
  checkBlockedUser,
  checkMutualLikes
} from "../../common.mjs";
import client from "../../sql/sql.mjs";
import updatePopularityScore from "./popularityScore.mjs";
import { notifyUser } from "./notifications.mjs";

const toggleLike = async (userName, targetUser) => {
  const liking_user_id = await getUserId(userName);
  const liked_user_id = await getUserId(targetUser);
  if (!liking_user_id || !liked_user_id) {
    return { validated: false };
  } else {
    if (!(await checkBlockedUser(userName, targetUser))) {
      return {
        validated: false
      };
    } else {
      let text = `SELECT count(*) FROM user_like WHERE liking_user_id = $1 AND liked_user_id = $2`;
      let values = [liking_user_id, liked_user_id];
      return await client
        .query(text, values)
        .then(async ({ rows: [{ count }] }) => {
          text =
            count === "0"
              ? `INSERT INTO user_like (liking_user_id, liked_user_id, date) VALUES ($1, $2, ${Math.floor(
                  Date.now()
                )})`
              : `DELETE FROM user_like WHERE liking_user_id = $1 AND liked_user_id = $2`;
          let values = [liking_user_id, liked_user_id];
          return await client
            .query(text, values)
            .then(async () => {
              if (count === "0") {
                const { validated } = await checkMutualLikes(
                  liking_user_id,
                  liked_user_id
                );
                if (validated) {
                  notifyUser(userName, targetUser, "match");
                } else {
                  notifyUser(userName, targetUser, "like");
                }
              } else {
                notifyUser(userName, targetUser, "dislike");
              }
              const score = await updatePopularityScore(
                userName,
                liked_user_id
              );
              if (score === false) {
                return { validated: false };
              } else {
                return count === "0"
                  ? {
                      validated: true,
                      message: "User loved successfully !",
                      score
                    }
                  : {
                      validated: true,
                      message: "User disloved successfully !",
                      score
                    };
              }
            })
            .catch(e => {
              console.error(e.stack);
              return { validated: false };
            });
        })
        .catch(e => {
          console.error(e.stack);
          return {
            validated: false
          };
        });
    }
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
      let { validated, score } = await toggleLike(
        req.body.userName,
        req.body.targetUser
      );
      if (validated == false) {
        error = true;
        res.send({
          validated: false,
          message: "We got a problem with our loving function, please try again"
        });
      } else {
        res.send({
          infos: await checkMatch(self_user_id, target_user_id),
          score
        });
      }
    } else if (error === false) {
      res.send({ infos: await checkMatch(self_user_id, target_user_id) });
    }
  }
};

export { toggleLike, checkLikeAndMatch };
