"use client";
import {SessionProvider} from "next-auth/react";
import React, {ReactNode} from "react";

interface Props {
  children: ReactNode;
}
const AuthSessionProvider = ({children}: Props) => {
  return (
    <SessionProvider>
      <div>{children}</div>
    </SessionProvider>
  );
};

export default AuthSessionProvider;
