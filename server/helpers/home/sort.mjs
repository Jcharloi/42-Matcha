import {
  sortByAge,
  sortByDistance,
  sortByPopularity,
  sortByTagsInCommon
} from "./sortBy.mjs";

const sortByIndex = (req, res) => {
  if (
    (req.body.userMatchInfo &&
      req.body.userMatchInfo.length > 0 &&
      req.body.index &&
      req.body.age &&
      req.body.index === "Age") ||
    req.body.index === "Localisation" ||
    req.body.index === "Popularity" ||
    req.body.index === "Tags"
  ) {
    if (req.body.index === "Age") {
      res.send({
        validated: true,
        userMatchInfo: sortByAge(req.body.userMatchInfo, req.body.age)
      });
    } else if (req.body.index === "Localisation") {
      res.send({
        validated: true,
        userMatchInfo: sortByDistance(req.body.userMatchInfo)
      });
    } else if (req.body.index === "Popularity") {
      res.send({
        validated: true,
        userMatchInfo: sortByPopularity(req.body.userMatchInfo)
      });
    } else if (req.body.index === "Tags") {
      res.send({
        validated: true,
        userMatchInfo: sortByTagsInCommon(req.body.userMatchInfo)
      });
    }
  } else {
    res.send({
      validated: false,
      message: "Wrong index"
    });
  }
};

export { sortByIndex };
