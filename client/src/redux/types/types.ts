import { User } from "../../models/models";

//types des Actions
export const INSERT_USER_PROFILE = "INSERT_USER_PROFILE";

export interface InsertProfileAction {
  type: typeof INSERT_USER_PROFILE;
  payload: User;
}

//nom des retours pour le fichier action
// export type ProfileAction = GetProfileAction | InsertProfileAction;
// export type CounterAction = IncrementAction | DecrementAction;
