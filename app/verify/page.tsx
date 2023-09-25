"use client";
import {useEffect, useState} from "react";
import {toast} from "react-toastify";
import {notFound, useRouter} from "next/navigation";

interface Props {
  searchParams: {token: string; userId: string};
}

export default function Verify(props: Props) {
  const {token, userId} = props.searchParams;
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const verifyUser = async () => {
      const requestBody = {
        userId,
        token,
      };

      try {
        const response = await fetch("/api/users/verify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
          const errorData = await response.json();
          setError(errorData.error);
          toast.error(errorData.error); // Display error toast
        } else {
          const data = await response.json();
          toast.success(data.message); // Display success toast
          router.replace("/");
        }
      } catch (error) {
        console.error("Error:", error);
        setError("An error occurred"); // Set a generic error message
        toast.error("An error occurred"); // Display error toast
      }
    };

    verifyUser();
  }, [userId, token, router]);

  // Verify the token and userId
  if (!token || !userId) return notFound();

  return (
    <div className="flex flex-col justify-center items-center h-[80vh]">
      {error ? (
        <div className="text-red-500 text-2xl mb-4 animate-pulse">{error}</div>
      ) : (
        <div className="text-2xl opacity-70 text-center p-5 animate-pulse">
          Please wait...
          <p>We are verifying your email</p>
        </div>
      )}
    </div>
  );
}
