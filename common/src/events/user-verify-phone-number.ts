import { Subjects } from "./types/subjects";

export interface UserVerifyPhoneNumbervent {
  subject: Subjects.UserVerifyPhoneNumber;
  data: {
    to: string;
    body: string;
  };
}