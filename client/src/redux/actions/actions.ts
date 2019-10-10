import {
  INSERT_USER_PROFILE,
  UPDATE_USER_AUTH,
  INSERT_OTHER_PROFILE,
  CONNECT_SOCKET,
  InsertProfileAction,
  UpdateAuthAction,
  UpdateConnectSocket
} from "../types/types";
import { User, VerifiedUser } from "../../models/models";

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

export function connectSocket(data: {}): UpdateConnectSocket {
  return {
    type: CONNECT_SOCKET,
    payload: data
  };
}
