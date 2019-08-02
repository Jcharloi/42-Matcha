import { InsertProfileAction } from "../types/types";
import { User } from "../../models/models";

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

export const insertUserProfileReducer = (
  state = initialState,
  action: InsertProfileAction
): User => {
  switch (action.type) {
    case "INSERT_USER_PROFILE": {
      return {
        user_id: action.payload.user_id,
        mail: action.payload.mail,
        user_name: action.payload.user_name,
        last_name: action.payload.last_name,
        first_name: action.payload.first_name,
        birthday: action.payload.birthday,
        gender: action.payload.gender,
        orientation: action.payload.orientation,
        presentation: action.payload.presentation,
        score: action.payload.score,
        city: action.payload.city,
        pictures: action.payload.pictures,
        tags: action.payload.tags
      };
    }
    default:
      return state;
  }
};
