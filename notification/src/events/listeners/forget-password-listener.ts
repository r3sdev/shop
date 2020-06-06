import { Message } from 'node-nats-streaming';
import { UserForgotPasswordEvent, Listener, Subjects } from '@ramsy-it/common';
import { queueGroupName } from './queue-group-name';

export class ForgetPasswordListener extends Listener<UserForgotPasswordEvent> {
  subject: Subjects.UserForgotPassword = Subjects.UserForgotPassword;
  queueGroupName = queueGroupName;

  async onMessage(data: UserForgotPasswordEvent['data'], msg: Message) {
    console.log(event);

    msg.ack();
  }
}
