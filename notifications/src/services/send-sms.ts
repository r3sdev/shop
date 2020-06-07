import twillio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

export default async (to: string, body: string) => {
  const client = twillio(accountSid, authToken);
  return client.messages
    .create({ body, from: '+3197014203090', to })
    .then((message) => console.log(message.sid))
    .catch(err => console.log(err))
};
