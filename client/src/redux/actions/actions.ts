import {
  INSERT_USER_PROFILE,
  UPDATE_USER_AUTH,
  INSERT_OTHER_PROFILE,
  InsertProfileAction,
  UpdateAuthAction,
  InsertOtherProfileAction
} from "../types/types";
import { User, VerifiedUser, UserMatchInfos } from "../../models/models";

export function insertUserProfile(data: User): InsertProfileAction {
  return {
    type: INSERT_USER_PROFILE,
    payload: data
  };
}

export function insertOtherProfile(
  data: UserMatchInfos
): InsertOtherProfileAction {
  return {
    type: INSERT_OTHER_PROFILE,
    payload: data
  };
}

export function updateUserAuth(data: VerifiedUser): UpdateAuthAction {
  return {
    type: UPDATE_USER_AUTH,
    payload: data
  };
}
