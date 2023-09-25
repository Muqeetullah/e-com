import {useSession} from "next-auth/react";
interface Auth {
  loading: boolean;
  loggedIn: boolean;
  isAdmin: boolean;
}
const useAuth = (): Auth => {
  const session = useSession();
  console.log(session);
  return {
    loading: session.status === "loading",
    loggedIn: session.status === "authenticated",
    isAdmin: false,
  };
};

export default useAuth;
