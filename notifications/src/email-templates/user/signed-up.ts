export default (link: string) => ({
  text: `
Please verify your email by clicking this link: ${link}
`,
  html: `
Please verify your email by clicking <a href="${link}">here</a>
`,
});
