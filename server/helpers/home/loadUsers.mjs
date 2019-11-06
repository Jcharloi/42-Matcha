import { userMatchInfo } from "../home/match.mjs";

const loadUsers = offset => {
  const newOffset = parseInt(offset);
  const newUsers = userMatchInfo;
  return {
    newUsersMatchInfo: newUsers.slice(newOffset, newOffset + 10)
  };
};

const loadUsersRoute = (req, res) => {
  res.send(loadUsers(req.body.offset));
};

export { loadUsers, loadUsersRoute };
