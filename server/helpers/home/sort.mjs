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

const sortByInterval = (req, res) => {
  if (!req.body.index || !req.body.start || !req.body.end) {
    res.send({ validated: false, message: "No empty params allowed" });
  } else {
    if (
      (req.body.index === "Age" &&
        validIntervalParam(req.body.start, req.body.end, 18, 100)) ||
      (req.body.index === "Popularity" &&
        validIntervalParam(req.body.start, req.body.end, 0, 100)) ||
      (req.body.index === "Localisation" &&
        validIntervalParam(req.body.start, req.body.end, 0, 300)) ||
      (req.body.index === "Tags" && req.body.tagsName.length > 0)
    ) {
      //tag existe ?
      res.send({
        validated: true,
        userMatchInfo: userMatchInfo.filter(user => {
          return user.tags.map(tag => {
            if (tag.name === req.body.tagsName) {
              //
            }
          });
        })
      });
    } else {
      res.send({ validated: false, message: "Something wrong with params" });
    }
  }
};

export default { sortByIndex, sortByInterval };
