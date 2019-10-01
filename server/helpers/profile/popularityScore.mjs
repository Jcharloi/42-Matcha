import client from "../../sql/sql.mjs";

const updatePopularityScore = async likedUserId => {
  let text = `SELECT count(*) FROM user_visit WHERE visited_user_id = $1`;
  let values = [likedUserId];
  return await client
    .query(text, values)
    .then(async ({ rows: [{ count }] }) => {
      const nbOfVisits = parseInt(count);
      text = `SELECT count(*) FROM user_like WHERE liked_user_id = $1`;
      values = [likedUserId];
      return await client
        .query(text, values)
        .then(async ({ rows: [{ count }] }) => {
          const nbOfLikes = parseInt(count);
          const score = Math.round((nbOfLikes / nbOfVisits) * 100);
          text = `UPDATE users SET score=${score} WHERE user_id='${likedUserId}'`;
          return await client
            .query(text)
            .then(() => {
              return score;
            })
            .catch(e => {
              console.error(e.stack);
            });
        })
        .catch(e => {
          console.error(e.stack);
        });
    })
    .catch(e => {
      console.error(e.stack);
    });
};

export default updatePopularityScore;
