export default (link: string) => ({
  text: `
We received a request to reset your password. 
Please create a new password by clicking this link: ${link}

This request will expire in 1 hour.

If you did not request this change, no changes have been made to your account. 
We recommend that you review your security settings: https://ticketing.ramsy.dev/docs/accounts/security/
`,
  html: `
We received a request to reset your password.<br />
Please create a new password by clicking this <a href="${link}">link</a><br />
<br />
This request will expire in 1 hour.<br />
<br />
If you did not request this change, no changes have been made to your account. <br />
We recommend that you review your security settings: 
<a href="https://ticketing.ramsy.dev/docs/accounts/security/">https://ticketing.ramsy.dev/docs/accounts/security/</a> <br />

      `,
});
