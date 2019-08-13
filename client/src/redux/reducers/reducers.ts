import {
  InsertProfileAction,
  INSERT_USER_PROFILE,
  UpdateAuthAction,
  UPDATE_USER_AUTH
} from "../types/types";
import { User, VerifiedUser } from "../../models/models";

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
): User => {
  switch (action.type) {
    case INSERT_USER_PROFILE: {
      return Object.assign({}, state, action.payload);
    }
    default:
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
