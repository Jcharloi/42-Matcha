import { UpdateProfileAction, UPDATE_USER_PROFILE } from "../types/types";
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
  action: UpdateProfileAction
): User => {
  switch (action.type) {
    case UPDATE_USER_PROFILE: {
      return Object.assign({}, state, action.payload);
    }
    default:
      return state;
  }
};

let verifiedState = {
  isAuth: false,
  isCompleted: true
};

export const verifiedUserReducer = (state = verifiedState): VerifiedUser => {
  return state;
};
