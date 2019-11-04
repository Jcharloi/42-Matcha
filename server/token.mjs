import jwt from "jsonwebtoken";
import client from "./sql/sql.mjs";
import keys from "./keys.json";
import { updateLastConnection } from "./helpers/auth/updateLastConnection.mjs";
import { updateToken } from "./common.mjs";
const { secret } = keys;

const verifyToken = async (req, res) => {
  if (req.body.token && req.body.userName) {
    const response = await checkAuthToken(req.body.token, req.body.userName);
    response.validToken
      ? res.send({ authToken: true })
      : res.send({ authToken: false });
  } else {
    res.send({ authToken: false });
  }
};

const tokenMiddleware = async (req, res, next) => {
  const response = await checkAuthToken(req.body.token, req.body.userName);
  response.validToken ? next() : res.send(response);
};

const checkAuthToken = async (token, userName) => {
  if (!token || !userName) {
    return {
      validToken: false,
      message: "Stop playing with our localStorage 😤"
    };
  }
  return await jwt.verify(token, secret, async (err, decoded) => {
    const userId = await getUserIdFromToken(token);
    if (!err) {
      const text = `SELECT token FROM users WHERE user_name = $1`;
      const values = [userName];
      return await client
        .query(text, values)
        .then(async ({ rows }) => {
          if (rows.length > 0 && rows[0].token === token) {
            return {
              validToken: true
            };
          } else {
            await updateLastConnection(userId);
            await updateToken(userId, null);
            return {
              validToken: false,
              message: "Stop playing with our localStorage 😤"
            };
          }
        })
        .catch(async e => {
          console.error(e.stack);
          await updateLastConnection(userId);
          await updateToken(userId, null);
          return {
            validToken: false,
            message: "Stop playing with our localStorage 😤"
          };
        });
    } else {
      await updateLastConnection(userId);
      await updateToken(userId, null);
      return {
        validToken: false,
        message: "Stop playing with our localStorage 😤"
      };
    }
  });
};

const getUserIdFromToken = async token => {
  return await client
    .query(`SELECT user_id FROM users WHERE token = $1`, [token])
    .then(({ rows }) => {
      if (rows.length > 0) return rows[0].user_id;
    })
    .catch(e => {
      console.error(e.stack);
    });
};

export { verifyToken, tokenMiddleware, checkAuthToken };
