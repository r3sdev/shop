import { Subjects } from "./types/subjects";

export interface UserVerifyPhoneNumberEvent {
  subject: Subjects.UserVerifyPhoneNumber;
  data: {
    to: string;
    body: string;
  };
}