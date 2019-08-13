import {
  INSERT_USER_PROFILE,
  UPDATE_USER_AUTH,
  InsertProfileAction,
  UpdateAuthAction
} from "../types/types";
import { User, VerifiedUser } from "../../models/models";

export function insertUserProfile(data: User): InsertProfileAction {
  return {
    type: INSERT_USER_PROFILE,
    payload: data
  };
}

export function updateUserAuth(data: VerifiedUser): UpdateAuthAction {
  return {
    type: UPDATE_USER_AUTH,
    payload: data
  };
}
