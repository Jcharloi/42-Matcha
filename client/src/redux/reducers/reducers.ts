import {
  InsertProfileAction,
  INSERT_USER_PROFILE,
  UPDATE_USER_AUTH,
  INSERT_OTHER_PROFILE,
  UpdateAuthAction,
  InsertOtherProfileAction
} from "../types/types";
import { VerifiedUser, UserMatchInfos } from "../../models/models";

let initialState = {
  user_id: "",
  mail: "",
  user_name: "",
  last_name: "",
  first_name: "",
  birthday: "",
  gender: "",
  orientation: "",
  presentation: "",
  score: "",
  city: "",
  pictures: [{ path: "", date: "", main: false }],
  tags: [{ tag_id: "", name: "", custom: false }]
};

export const userProfileReducer = (
  state = initialState,
  action: InsertProfileAction
) => {
  switch (action.type) {
    case INSERT_USER_PROFILE: {
      return Object.assign({}, state, action.payload);
    }
    default:
      return state;
  }
};

let initialStateOther = {
  id: "",
  name: "",
  city: "",
  age: "",
  connection: "",
  gender: "",
  popularityScore: "",
  pictures: [{ path: "", date: "", main: false }],
  tags: [{ tag_id: "", name: "", custom: false }],
  liked: false
};

export const otherProfileReducer = (
  state = initialStateOther,
  action: InsertOtherProfileAction
): UserMatchInfos => {
  if (action.type === INSERT_OTHER_PROFILE) {
    return Object.assign({}, state, action.payload);
  } else {
    return state;
  }
};

let verifiedState = {
  isAuth: false,
  isCompleted: false
};

export const verifiedUserReducer = (
  state = verifiedState,
  action: UpdateAuthAction
): VerifiedUser => {
  if (action.type === UPDATE_USER_AUTH) {
    return Object.assign({}, state, action.payload);
  } else {
    return state;
  }
};
