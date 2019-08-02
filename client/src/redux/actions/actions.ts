import { INSERT_USER_PROFILE, InsertProfileAction } from "../types/types";
import { User } from "../../models/models";

export function insertUserProfile(data: User): InsertProfileAction {
  return {
    type: INSERT_USER_PROFILE,
    payload: data
  };
}
