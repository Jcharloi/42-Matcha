import {
  INSERT_USER_PROFILE,
  UPDATE_USER_AUTH,
  INSERT_OTHER_PROFILE,
  InsertProfileAction,
  UpdateAuthAction,
  UpdateNumberOfAction,
  UPDATE_NUMBER_OF
} from "../types/types";
import { User, VerifiedUser, NumberOf } from "../../models/models";

export function insertUserProfile(data: User): InsertProfileAction {
  return {
    type: INSERT_USER_PROFILE,
    payload: data
  };
}

export function insertOtherProfile(data: User): InsertProfileAction {
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

export function updateNumberOf(data: NumberOf): UpdateNumberOfAction {
  return {
    type: UPDATE_NUMBER_OF,
    payload: data
  };
}
