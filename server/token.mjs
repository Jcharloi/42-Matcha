import jwt from "jsonwebtoken";
import client from "./sql/sql.mjs";
import keys from "./keys.json";
import { getUserId } from "./common.mjs";
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
    if (err) {
      const userId = await getUserId(userName);
      let text = `UPDATE users SET last_connection = '${Math.floor(
        Date.now()
      )}' WHERE user_id = '${userId}'`;
      return await client
        .query(text)
        .then(() => {
          return {
            validToken: false,
            message: "Stop playing with our localStorage 😤"
          };
        })
        .catch(e => {
          console.error(e.stack);
          return {
            validToken: false,
            message: "Stop playing with our localStorage 😤"
          };
        });
    } else {
      const text = `SELECT * FROM users WHERE user_name = $1`;
      const values = [userName];
      const response = await client
        .query(text, values)
        .then(async ({ rowCount }) => {
          if (rowCount === 1) {
            return {
              validToken: true
            };
          }
          return {
            validToken: false,
            message: "Stop playing with our localStorage 😤"
          };
        })
        .catch(e => {
          console.error(e);
          return {
            validToken: false,
            message: "Stop playing with our localStorage 😤"
          };
        });
      return response;
    }
  });
};

export { verifyToken, tokenMiddleware, checkAuthToken };
