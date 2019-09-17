import { sortByAge } from "./sortBy.mjs";
import { sortByDistance } from "./sortBy.mjs";
import { sortByPopularity } from "./sortBy.mjs";
import { sortByTagsInCommon } from "./sortBy.mjs";
import { validIntervalParam } from "../validInfos.mjs";

const compareTag = (myTags, tagUser) => {
  return (
    myTags.findIndex(myTag => {
      return myTag === tagUser;
    }) != -1
  );
};

const filterByInterval = (req, res) => {
  if (
    !req.body.index ||
    !req.body.startAge ||
    !req.body.endAge ||
    !req.body.startLoc ||
    !req.body.endLoc ||
    !req.body.startPop ||
    !req.body.endPop ||
    !req.body.userMatchInfo
  ) {
    res.send({ validated: false, message: "No empty params allowed" });
  } else {
    const startAge = parseInt(req.body.startAge);
    const endAge = parseInt(req.body.endAge);
    const startLoc = parseInt(req.body.startLoc);
    const endLoc = parseInt(req.body.endLoc);
    const startPop = parseInt(req.body.startPop);
    const endPop = parseInt(req.body.endPop);
    if (
      (validIntervalParam(startAge, endAge, 18, 100) &&
        validIntervalParam(startLoc, endLoc, 0, 1000) &&
        validIntervalParam(startPop, endPop, 0, 100)) ||
      (req.body.index === "Tags" && req.body.tagsName.length > 0)
    ) {
      let userMatchInfo = req.body.userMatchInfo;
      userMatchInfo = userMatchInfo.filter(user => {
        return user.age >= startAge && user.age <= endAge;
      });
      userMatchInfo = userMatchInfo.filter(user => {
        return user.distance >= startLoc && user.distance <= endLoc;
      });
      userMatchInfo = userMatchInfo.filter(user => {
        return (
          user.popularityScore >= startPop && user.popularityScore <= endPop
        );
      });
      if (req.body.tagsName.length > 0) {
        userMatchInfo = userMatchInfo.filter(user => {
          let hasToDelete = false;
          user.tags.map(tag => {
            if (!hasToDelete) {
              hasToDelete = compareTag(req.body.tagsName, tag.name);
            }
          });
          return hasToDelete;
        });
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

export { sortByIndex, filterByInterval };
