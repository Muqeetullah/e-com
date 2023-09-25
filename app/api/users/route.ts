import startDb from "@/lib/db";
import UserModel from "@/models/usermodel";
import {NextResponse} from "next/server";
import {NewUserRequest} from "@/types/NewUserRequest";
import nodemailer from "nodemailer";
import EmailVerificationToken from "@/models/emailVerificationCode";
import crypto from "crypto";

export const POST = async (req: Request) => {
  const body = (await req.json()) as NewUserRequest;
  await startDb();

  const newUser = await UserModel.create({
    ...body,
  });
  const token = crypto.randomBytes(36).toString("hex");
  await EmailVerificationToken.create({
    user: newUser._id,
    token,
  });
  const transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "87920f46b4c465",
      pass: "1fe60eb31f85c7",
    },
  });
  const verificationUrl = `http://localhost:3000/verify?token=${token}&userId=${newUser._id}`;
  await transport.sendMail({
    from: "verification@nextecom.com",
    to: newUser.email,
    html: `<h1>Please verify your email by clicking on <a href="${verificationUrl}">this link</a> </h1>`,
  });
  return NextResponse.json({
    message: "Check Your Email For Verifiacation",
  });
};
