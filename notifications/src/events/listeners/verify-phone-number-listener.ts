import { Message } from 'node-nats-streaming';
import {
  UserVerifyPhoneNumberEvent,
  Listener,
  Subjects,
} from '@ramsy-it/common';
import { queueGroupName } from './queue-group-name';
import sendSMS from '../../services/send-sms';
import forgotPassword from '../../email-templates/user/forgot-password';

export class VerifyPhoneNumberListener extends Listener<
  UserVerifyPhoneNumberEvent
> {
  subject: Subjects.UserVerifyPhoneNumber = Subjects.UserVerifyPhoneNumber;
  queueGroupName = queueGroupName;

  async onMessage(data: UserVerifyPhoneNumberEvent['data'], msg: Message) {
    const { to, body } = data;

    await sendSMS(to, body);

    msg.ack();
  }
}
