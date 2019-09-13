const sortByAge = (userMatchInfo) => {
  return userMatchInfo.sort((userA, userB) => {
    const deltaA = Math.abs(req.body.age - userA.age);
    const deltaB = Math.abs(req.body.age - userB.age);
    return deltaA - deltaB;
  });
}

const sortByDistance = (userMatchInfo) => {
  return userMatchInfo.sort((userA, userB) => {
    return userA.distance - userB.distance;
  });
}

const sortByPopularity = (userMatchInfo) => {
  return userMatchInfo.sort((userA, userB) => {
    return userB.popularityScore - userA.popularityScore;
  });
}
const sortByTagsInCommon = (userMatchInfo) => {
  return userMatchInfo.sort((userA, userB) => {
    return userB.scoreTags - userA.scoreTags;
  });
}

export { sortByAge, sortByDistance, sortByPopularity, sortByTagsInCommon };
