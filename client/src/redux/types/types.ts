import { User, VerifiedUser, UserMatchInfos } from "../../models/models";

export const INSERT_USER_PROFILE = "INSERT_USER_PROFILE";
export const INSERT_OTHER_PROFILE = "INSERT_OTHER_PROFILE";
export const UPDATE_USER_AUTH = "UPDATE_USER_AUTH";

export interface InsertProfileAction {
  type: typeof INSERT_USER_PROFILE;
  payload: User;
}

export interface InsertOtherProfileAction {
  type: typeof INSERT_OTHER_PROFILE;
  payload: UserMatchInfos;
}

export interface UpdateAuthAction {
  type: typeof UPDATE_USER_AUTH;
  payload: VerifiedUser;
}

export interface State {
  verified: VerifiedUser;
  user: User;
  otherUser: UserMatchInfos;
}
