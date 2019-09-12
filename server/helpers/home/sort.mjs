const sortByIndex = (req, res) => {
  if (
    (req.body.index && req.body.age && req.body.index === "Age") ||
    req.body.index === "Localisation" ||
    req.body.index === "Popularity" ||
    req.body.index === "Tags"
  ) {
    if (req.body.index === "Age") {
      res.send({
        validated: true,
        userMatchInfo: req.body.userMatchInfo.sort((userA, userB) => {
          const deltaA = Math.abs(req.body.age - userA.age);
          const deltaB = Math.abs(req.body.age - userB.age);
          return deltaA - deltaB;
        })
      });
    } else if (req.body.index === "Localisation") {
      res.send({
        validated: true,
        userMatchInfo: req.body.userMatchInfo.sort((userA, userB) => {
          return userA.distance - userB.distance;
        })
      });
    } else if (req.body.index === "Popularity") {
      res.send({
        validated: true,
        userMatchInfo: req.body.userMatchInfo.sort((userA, userB) => {
          return userB.popularityScore - userA.popularityScore;
        })
      });
    } else if (req.body.index === "Tags") {
      res.send({
        validated: true,
        userMatchInfo: req.body.userMatchInfo.sort((userA, userB) => {
          return userB.scoreTags - userA.scoreTags;
        })
      });
    }
  } else {
    res.send({
      validated: false,
      message: "Wrong index"
    });
  }
};

export default { sortByIndex };
