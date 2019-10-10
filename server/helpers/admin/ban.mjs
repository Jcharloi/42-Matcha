import client from "../../sql/sql.mjs";

const ban = async (req, res) => {
  console.log(req.body.targetUserId);
  let text = "DELETE FROM users WHERE user_id = $1";

  let values = [req.body.targetUserId];
  console.log(text);
  await client
    .query(text, values)
    .then(() => {
      res.send({ valdated: true });
    })
    .catch(e => {
      console.error(e);
      res.send({ validated: false });
    });
};

export default ban;
