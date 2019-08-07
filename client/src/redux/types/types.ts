import { User, VerifiedUser } from "../../models/models";

export const UPDATE_USER_PROFILE = "UPDATE_USER_PROFILE";
export const UPDATE_USER_AUTH = "UPDATE_USER_AUTH";

export interface UpdateProfileAction {
  type: typeof UPDATE_USER_PROFILE;
  payload: User;
}

export interface UpdateAuthAction {
  type: typeof UPDATE_USER_AUTH;
  payload: VerifiedUser;
}

export interface State {
  verified: VerifiedUser;
  user: User;
}
