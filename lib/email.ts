import nodemailer from "nodemailer";

type profile = {name: string; email: string};

const sender = {
  email: "nextecom@reactnativehive.com",
  name: "Next Ecom Verification",
};

interface EmailOptions {
  profile: profile;
  subject: "verification" | "forget-password" | "password-changed";
  linkUrl?: string;
}

const generateMailTransporter = () => {
  const transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "87920f46b4c465",
      pass: "1fe60eb31f85c7",
    },
  });
  return transport;
};

const sendEmailVerificationLink = async (profile: profile, linkUrl: string) => {
  const transport = generateMailTransporter();
  await transport.sendMail({
    from: "verification@nextecom.com",
    to: profile.email,
    html: `<h1>Please verify your email by clicking on <a href="${linkUrl}">this link</a> </h1>`,
  });
};

const sendForgetPasswordLink = async (profile: profile, linkUrl: string) => {
  const transport = generateMailTransporter();

  await transport.sendMail({
    from: "verification@nextecom.com",
    to: profile.email,
    html: `<h1>Click on <a href="${linkUrl}">this link</a> to reset your password.</h1>`,
  });
};

const sendUpdatePasswordConfirmation = async (profile: profile) => {
  const transport = generateMailTransporter();

  await transport.sendMail({
    from: "verification@nextecom.com",
    to: profile.email,
    html: `<h1>We changed your password <a href="${process.env.NEXT_PUBLIC_SIGNIN_URL}">click here</a> to sign in.</h1>`,
  });
};

export const sendEmail = (options: EmailOptions) => {
  const {profile, subject, linkUrl} = options;

  switch (subject) {
    case "verification":
      return sendEmailVerificationLink(profile, linkUrl!);
    case "forget-password":
      return sendForgetPasswordLink(profile, linkUrl!);
    case "password-changed":
      return sendUpdatePasswordConfirmation(profile);
  }
};
