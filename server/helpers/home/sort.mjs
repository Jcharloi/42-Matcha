import { sortByAge } from "./sortBy.mjs";
import { sortByDistance } from "./sortBy.mjs";
import { sortByPopularity } from "./sortBy.mjs";
import { sortByTagsInCommon } from "./sortBy.mjs";

const validIntervalParam = (start, end, startNb, endNb) => {
  if (start >= startNb && start <= endNb && end >= startNb && end <= endNb) {
    return true;
  }
  return false;
};

const compareTag = (myTags, tagUser) => {
  return (
    myTags.findIndex(myTag => {
      return myTag === tagUser;
    }) != -1
  );
};

const sortByInterval = (req, res) => {
  if (
    !req.body.index ||
    !req.body.start ||
    !req.body.end ||
    !req.body.userMatchInfo
  ) {
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
      let userMatchInfo = req.body.userMatchInfo;
      if (req.body.index === "Tags") {
        userMatchInfo = userMatchInfo.filter(user => {
          let hasToDelete = false;
          user.tags.map(tag => {
            if (!hasToDelete) {
              hasToDelete = compareTag(req.body.tagsName, tag.name);
            }
          });
          return hasToDelete;
        });
      } else if (req.body.index === "Age") {
        //
      }
      res.send({
        validated: true,
        userMatchInfo
      });
    } else {
      res.send({ validated: false, message: "Something wrong with params" });
    }
  }
};

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
        userMatchInfo: sortByAge(req.body.userMatchInfo)
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

export { sortByIndex, sortByInterval };
