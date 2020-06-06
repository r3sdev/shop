import { Message } from 'node-nats-streaming';
import { Listener, Subjects, UserSignedUpEvent } from '@ramsy-it/common';
import { queueGroupName } from './queue-group-name';
import sendEmail from '../../services/send-email';
import userSignedUp from '../../email-templates/user/signed-up';

export class UserSignedUpListener extends Listener<UserSignedUpEvent> {
  subject: Subjects.UserSignedUp = Subjects.UserSignedUp;
  queueGroupName = queueGroupName;

  async onMessage(data: UserSignedUpEvent['data'], msg: Message) {

    const { html, text } = userSignedUp(data.link);

    await sendEmail({
      from: 'support@ramsy.dev',
      to: data.email,
      html,
      text,
      subject: 'Please verify your email address',
    });

    msg.ack();
  }
}
