import startDb from "@/lib/db";
import UserModel from "@/models/usermodel";
import {NextResponse} from "next/server";
import {NewUserRequest} from "@/types/NewUserRequest";
import nodemailer from "nodemailer";
import EmailVerificationToken from "@/models/emailVerificationCode";
import crypto from "crypto";
import {sendEmail} from "@/lib/email";

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

  const verificationUrl = `${process.env.NEXT_PUBLIC_VERIFICATION_URL}?token=${token}&userId=${newUser._id}`;
  sendEmail({
    profile: {name: newUser.name, email: newUser.email},
    subject: "verification",
    linkUrl: verificationUrl,
  });

  return NextResponse.json({
    message: "Check Your Email For Verifiacation",
  });
};
