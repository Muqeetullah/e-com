import EmailVerificationToken from "@/models/emailVerificationCode";
import UserModel from "@/models/usermodel";
import {VerifyUser} from "@/types/VerifyRequest";
import {isValidObjectId} from "mongoose";
import {NextResponse} from "next/server";

export const POST = async (req: Request) => {
  const {token, userId} = (await req.json()) as VerifyUser;
  try {
    if (!isValidObjectId(userId) || !token) {
      return NextResponse.json({error: "Invalid request "}, {status: 401});
    }

    const verifyToken = await EmailVerificationToken.findOne({user: userId});
    if (!verifyToken) {
      return NextResponse.json({error: "Invalid Token "}, {status: 401});
    }
    const isMatched = await verifyToken.compareToken(token);
    if (!isMatched) {
      return NextResponse.json({error: "Token Dont Match"}, {status: 401});
    }

    await UserModel.findByIdAndUpdate(userId, {verified: true});
    await EmailVerificationToken.findByIdAndDelete(verifyToken._id);
    return NextResponse.json({message: "User Verified"});
  } catch (error) {
    return NextResponse.json({error: "SomeThing Went Wrong"}, {status: 500});
  }
};
