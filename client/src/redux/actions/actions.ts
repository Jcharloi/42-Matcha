import { UPDATE_USER_PROFILE, UpdateProfileAction } from "../types/types";
import { User } from "../../models/models";

export function updateUserProfile(data: User): UpdateProfileAction {
  return {
    type: UPDATE_USER_PROFILE,
    payload: data
  };
}
