import { createRandomId } from "../../common.mjs";
import { getUserId } from "../../common.mjs";

import client from "../../sql/sql.mjs";

const selectTags = async (req, res) => {
  const userId = await getUserId(req.body.userName);
  if (!userId) {
    res.send({ validated: false });
  } else {
    let text = `SELECT tag_id FROM tag WHERE name = $1`;
    let values = [req.body.tagName];
    await client
      .query(text, values)
      .then(async ({ rows, rowCount }) => {
        if (rowCount > 0) {
          text = `SELECT * FROM user_tag WHERE tag_id = '${rows[0].tag_id}' AND user_id = '${userId}'`;
          await client
            .query(text)
            .then(async ({ rowCount }) => {
              if (rowCount === 0) {
                text = `INSERT INTO user_tag (tag_id, user_id) VALUES ('${rows[0].tag_id}', '${userId}')`;
                await client
                  .query(text)
                  .then(() => {
                    res.send({
                      validated: true,
                      message: "Tag selected successfully!"
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
              } else {
                res.send({
                  validated: false,
                  message: "You already used this tag"
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
        } else {
          res.send({ validated: false, message: "This tag does not exists" });
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

const deleteTags = async (req, res) => {
  const userId = await getUserId(req.body.userName);
  if (!userId) {
    res.send({ validated: false });
  } else {
    let text = `SELECT tag_id, custom FROM tag WHERE name=$1`;
    let values = [req.body.tagName];
    await client
      .query(text, values)
      .then(async ({ rows, rowCount }) => {
        if (rowCount > 0) {
          const tagId = rows[0].tag_id;
          if (rows[0].custom) {
            text = `DELETE FROM tag WHERE tag_id='${tagId}' AND name = $1`;
            values = [req.body.tagName];
            await client.query(text, values).catch(e => {
              console.error(e);
              res.send({
                validated: false,
                message: "We got a problem with our database, please try again"
              });
            });
          }
          text = `DELETE FROM user_tag WHERE tag_id='${tagId}' AND user_id = '${userId}'`;
          await client
            .query(text)
            .then(() => {
              res.send({
                tagId,
                validated: true,
                message: "Tag removed successfully !"
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
          res.send({ validated: false, message: "This tag does not exists" });
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

const addCustomTags = async (req, res) => {
  const userId = await getUserId(req.body.userName);
  if (!userId || !req.body.customTag || req.body.customTag.length > 15) {
    res.send({ validated: false });
  } else {
    let text = `SELECT * FROM tag WHERE name = $1`;
    let values = [req.body.customTag];
    await client
      .query(text, values)
      .then(async ({ rowCount }) => {
        if (rowCount === 0) {
          const randomId = createRandomId(5);
          text = `INSERT INTO tag (tag_id, name, custom) VALUES ('${randomId}', $1, true)`;
          values = [req.body.customTag];
          await client
            .query(text, values)
            .then(async () => {
              text = `INSERT INTO user_tag (tag_id, user_id) VALUES ('${randomId}', '${userId}')`;
              await client
                .query(text)
                .then(() => {
                  res.send({
                    randomId,
                    validated: true,
                    message: "Custom tag added successfully !"
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
        } else {
          res.send({
            validated: false,
            message: "This custom tag already exists, try an other one !"
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

export { selectTags, deleteTags, addCustomTags };
