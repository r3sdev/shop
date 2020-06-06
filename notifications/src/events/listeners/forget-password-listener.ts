import { Message } from 'node-nats-streaming';
import { UserForgotPasswordEvent, Listener, Subjects } from '@ramsy-it/common';
import { queueGroupName } from './queue-group-name';
import sendEmail from '../../services/send-email';
import forgotPassword from '../../email-templates/user/forgot-password';

export class ForgetPasswordListener extends Listener<UserForgotPasswordEvent> {
  subject: Subjects.UserForgotPassword = Subjects.UserForgotPassword;
  queueGroupName = queueGroupName;

  async onMessage(data: UserForgotPasswordEvent['data'], msg: Message) {

    const {html, text} = forgotPassword(data.link);

    await sendEmail({
      from: 'support@ramsy.dev',
      to: data.email,
      html,
      text,
      subject: 'Reset your password'
    })

    msg.ack();
  }
}
