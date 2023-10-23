import UserModel from "@/models/usermodel";
import {ForgetPasswordRequest} from "@/types/ForgetPasswordRequest";
import {NextResponse} from "next/server";
import crypto from "crypto";
import PasswordResetTokenModel from "@/models/passwordVerificarionCode";
import nodemailer from "nodemailer";
import startDb from "@/lib/db";
import {sendEmail} from "@/lib/email";

export const POST = async (req: Request) => {
  try {
    const {email} = (await req.json()) as ForgetPasswordRequest;
    if (!email)
      return NextResponse.json({error: " Invalid email!"}, {status: 401});
    await startDb();
    const user = await UserModel.findOne({email});
    if (!user)
      return NextResponse.json({error: "user not found!"}, {status: 404});

    await PasswordResetTokenModel.findOneAndDelete({user: user._id});

    const token = crypto.randomBytes(36).toString("hex");
    await PasswordResetTokenModel.create({
      user: user._id,
      token,
    });

    const passwordResetURL = `${process.env.NEXT_PUBLIC_PASSWORD_RESET_URL}?token=${token}&userId=${user._id}`;

    sendEmail({
      profile: {name: user.name, email: user.email},
      subject: "forget-password",
      linkUrl: passwordResetURL,
    });

    return NextResponse.json({message: "Please Check Your Email"});
  } catch (error) {
    return NextResponse.json({error: (error as any).message}, {status: 500});
  }
};
