import { Subjects } from "./types/subjects";

export interface UserSignedUpEvent {
  subject: Subjects.UserSignedUp;
  data: {
    email: string;
    link: string;
  };
}