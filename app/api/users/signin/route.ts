import startDb from "@/lib/db";
import UserModel from "@/models/usermodel";
import {SignInCredentials} from "@/types/SigninCredential";
import {NextResponse} from "next/server";

export const POST = async (req: Request) => {
  const {email, password} = (await req.json()) as SignInCredentials;
  if (!email || !password)
    return NextResponse.json({
      error: "Invalid Request, Email or Password missing",
    });

  await startDb();
  const user = await UserModel.findOne({email});
  if (!user) return NextResponse.json({error: "Invalid Email or Password "});
  const passwordMatch = await user.comparePassword(password);
  if (!passwordMatch)
    return NextResponse.json({error: "Invalid Email or Password "});

  return NextResponse.json({
    user: {
      id: user._id.toString(),
      name: user.name,
      avatar: user.avatar?.url,
      role: user.role,
    },
  });
};
