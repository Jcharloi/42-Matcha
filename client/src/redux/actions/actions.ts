import {
  UPDATE_USER_PROFILE,
  UPDATE_USER_AUTH,
  UpdateProfileAction,
  UpdateAuthAction
} from "../types/types";
import { User, VerifiedUser } from "../../models/models";

export function updateUserProfile(data: User): UpdateProfileAction {
  return {
    type: UPDATE_USER_PROFILE,
    payload: data
  };
}

export function updateUserAuth(data: VerifiedUser): UpdateAuthAction {
  return {
    type: UPDATE_USER_AUTH,
    payload: data
  };
}
