import { User, VerifiedUser } from "../../models/models";

//types des Actions
export const UPDATE_USER_PROFILE = "UPDATE_USER_PROFILE";

export interface UpdateProfileAction {
  type: typeof UPDATE_USER_PROFILE;
  payload: User;
}

export interface State {
  verified: VerifiedUser;
  user: User;
}

//nom des retours pour le fichier action
// export type ProfileAction = GetProfileAction | InsertProfileAction;
// export type CounterAction = IncrementAction | DecrementAction;
