import { User, VerifiedUser, NumberOf } from "../../models/models";

export const INSERT_USER_PROFILE = "INSERT_USER_PROFILE";
export const INSERT_OTHER_PROFILE = "INSERT_OTHER_PROFILE";
export const UPDATE_USER_AUTH = "UPDATE_USER_AUTH";
export const UPDATE_NUMBER_OF = "UPDATE_NUMBER_OF";

export interface InsertProfileAction {
  type: typeof INSERT_USER_PROFILE | typeof INSERT_OTHER_PROFILE;
  payload: User;
}

export interface UpdateNumberOfAction {
  type: typeof UPDATE_NUMBER_OF;
  payload: NumberOf;
}

export interface UpdateAuthAction {
  type: typeof UPDATE_USER_AUTH;
  payload: VerifiedUser;
}

export interface State {
  verified: VerifiedUser;
  user: User;
  otherUser: User;
  numberOf: NumberOf;
}
