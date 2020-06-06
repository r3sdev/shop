import { Subjects } from "./types/subjects";

export interface UserForgotPasswordEvent {
  subject: Subjects.UserForgotPassword;
  data: {
    email: string;
  };
}