import client from "../../sql/sql.mjs";

const updatePopularityScore = async likedUserId => {
  let text = `SELECT count(*) FROM user_visit WHERE visited_user_id = $1`;
  let values = [likedUserId];
  await client
    .query(text, values)
    .then(async ({ rows: [{ count }] }) => {
      const nbOfVisits = parseInt(count);
      text = `SELECT count(*) FROM user_like WHERE liked_user_id = $1`;
      values = [likedUserId];
      await client
        .query(text, values)
        .then(async ({ rows: [{ count }] }) => {
          const nbOfLikes = parseInt(count);
          text = `UPDATE users SET score=${(nbOfLikes / nbOfVisits) *
            100} WHERE user_id='${likedUserId}'`;
          await client.query(text).catch(e => {
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
