import React, {ReactNode} from "react";

interface Props {
  children: ReactNode;
}
const AuthLayout = ({children}: Props) => {
  return (
    <div className="h-[90vh] flex items-center justify-center">{children}</div>
  );
};

export default AuthLayout;
