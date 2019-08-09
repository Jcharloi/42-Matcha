import jwt from "jsonwebtoken";
import client from "./sql/sql.mjs";
import keys from "./keys.json";
const { secret } = keys;

const verifyToken = async (req, res) => {
  if (req.body.token && req.body.userName) {
    const response = await checkAuthToken(req.body.token, req.body.userName);
    response.validated
      ? res.send({ authToken: true })
      : res.send({ authToken: false });
  } else {
    res.send({ authToken: false });
  }
};

const tokenMiddleware = async (req, res, next) => {
  const response = await checkAuthToken(req.body.token, req.body.userName);
  response.validated ? next() : res.send(response);
};

async function checkAuthToken(token, userName) {
  if (!token || !userName) {
    return {
      validated: false,
      message: "Stop playing with our localStorage 😤"
    };
  }
  return await jwt.verify(token, secret, async (err, decoded) => {
    if (err) {
      return {
        validated: false,
        message: "Stop playing with our localStorage 😤"
      };
    } else {
      const text = `SELECT * FROM users WHERE user_name = $1`;
      const values = [userName];
      const response = await client
        .query(text, values)
        .then(async ({ rowCount }) => {
          if (rowCount === 1) {
            return {
              validated: true
            };
          }
          return {
            validated: false,
            message: "Stop playing with our localStorage 😤"
          };
        })
        .catch(e => {
          console.error(e);
          return {
            validated: false,
            message: "Stop playing with our localStorage 😤"
          };
        });
      return response;
    }
  });
}

export default { verifyToken, tokenMiddleware, checkAuthToken };
