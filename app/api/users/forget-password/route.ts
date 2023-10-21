import UserModel from "@/models/usermodel";
import {ForgetPasswordRequest} from "@/types/ForgetPasswordRequest";
import {NextResponse} from "next/server";
import crypto from "crypto";
import PasswordResetTokenModel from "@/models/passwordVerificarionCode";
import nodemailer from "nodemailer";
import startDb from "@/lib/db";

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

    const transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "87920f46b4c465",
        pass: "1fe60eb31f85c7",
      },
    });

    await transport.sendMail({
      from: "verification@nextecom.com",
      to: user.email,
      html: `<h1>Click on <a href="${passwordResetURL}">this link</a> to reset your
      password.</h1>`,
    });

    return NextResponse.json({message: "Please Check Your Email"});
  } catch (error) {
    return NextResponse.json({error: (error as any).message}, {status: 500});
  }
};
