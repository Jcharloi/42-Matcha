export interface VerifiedUser {
  isAuth: boolean;
  isCompleted: boolean;
}

export interface User {
  user_id: string;
  mail: string;
  user_name: string;
  last_name: string;
  first_name: string;
  birthday: string;
  gender: string;
  orientation: string;
  presentation: string;
  score: string;
  city: string;
  pictures: Pictures[];
  tags: UserTags[];
  liked: boolean;
}

export interface UserMatchInfos {
  id: string;
  name: string;
  city: string;
  age: string;
  connection: string;
  gender: string;
  popularityScore: string;
  pictures: Array<Pictures>;
  tags: Array<UserTags>;
}

export interface Pictures {
  path: string;
  date: string;
  main: boolean;
}

export interface UserTags {
  tag_id: string;
  name: string;
  custom: boolean;
}

export interface Tags {
  id: string;
  name: string;
}
