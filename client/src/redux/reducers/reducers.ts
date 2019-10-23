import {
  InsertProfileAction,
  INSERT_USER_PROFILE,
  UPDATE_USER_AUTH,
  UpdateAuthAction,
  UpdateNumberOfAction,
  INSERT_OTHER_PROFILE,
  UPDATE_NUMBER_OF
} from "../types/types";
import { VerifiedUser, User, NumberOf } from "../../models/models";

let initialState = {
  user_id: "",
  mail: "",
  user_name: "",
  last_name: "",
  first_name: "",
  birthday: "",
  age: "",
  gender: "",
  orientation: "",
  presentation: "",
  score: "",
  city: "",
  pictures: [{ path: "", date: "", main: false }],
  tags: [{ tag_id: "", name: "", custom: false }],
  connection: "",
  liked: false
};

export const userProfileReducer = (
  state = initialState,
  action: InsertProfileAction
): User => {
  switch (action.type) {
    case INSERT_USER_PROFILE: {
      return Object.assign({}, state, action.payload);
    }
    default:
      return state;
  }
};

export const otherProfileReducer = (
  state = initialState,
  action: InsertProfileAction
): User => {
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

let numberOfState = {
  numberMessages: 0,
  numberNotifications: 0
};

export const updateNumberOfReducer = (
  state = numberOfState,
  action: UpdateNumberOfAction
): NumberOf => {
  if (action.type === UPDATE_NUMBER_OF) {
    return Object.assign({}, state, action.payload);
  } else {
    return state;
  }
};
