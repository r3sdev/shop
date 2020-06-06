import { transporter } from "..";

interface EmailOptions {
  from: string;
  to: string;
  subject: string;
  text: string;
  html: string;
}

export default async ({ from, to, subject, text, html }: EmailOptions) => {

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from,
    to,
    subject,
    text,
    html,
  });

  console.log('Message sent: %s', info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
};
