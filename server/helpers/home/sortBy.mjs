const sortByAge = (userMatchInfo, age) => {
  return userMatchInfo.sort((userA, userB) => {
    const deltaA = Math.abs(age - userA.age);
    const deltaB = Math.abs(age - userB.age);
    return deltaA - deltaB;
  });
};

const sortByDistance = userMatchInfo => {
  return userMatchInfo.sort((userA, userB) => {
    return userA.distance - userB.distance;
  });
};

const sortByPopularity = userMatchInfo => {
  return userMatchInfo.sort((userA, userB) => {
    return userB.popularityScore - userA.popularityScore;
  });
};
const sortByTagsInCommon = userMatchInfo => {
  return userMatchInfo.sort((userA, userB) => {
    return userB.scoreTags - userA.scoreTags;
  });
};

export { sortByAge, sortByDistance, sortByPopularity, sortByTagsInCommon };
