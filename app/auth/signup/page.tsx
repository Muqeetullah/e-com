"use client";
import React, {useState} from "react";
import AuthFormContainer from "@/components/authFormContainer";
import {Button, Input} from "@material-tailwind/react";
import {XMarkIcon} from "@heroicons/react/24/outline";
import {Formik, useFormik} from "formik";
import * as yup from "yup";
import {Spinner} from "@material-tailwind/react";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {toast} from "react-toastify";

const validationSchema = yup.object().shape({
  name: yup
    .string()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name cannot exceed 50 characters"),
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
});

export default function SignUp() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitting,
  } = useFormik({
    initialValues: {email: "", password: "", name: ""},
    validationSchema,
    onSubmit: async values => {
      setIsLoading(true);

      await fetch("/api/users", {
        method: "POST",
        body: JSON.stringify(values),
        headers: {
          "Content-Type": "application/json", // Set the Content-Type header for JSON
        },
      }).then(async res => {
        if (res.ok) {
          const {message} = (await res.json()) as {message: string};
          toast.success(message);
          // router.push("/");
        }

        setIsLoading(false);
      });
    },
  });

  const {name, email, password} = values;

  const touchedKeys = Object.entries(touched).map(([key, value]) => {
    if (value) return key;
  });

  const finalError: string[] = [];
  Object.entries(errors).forEach(([key, value]) => {
    if (touchedKeys.includes(key) && value) finalError.push(value);
  });

  const formErrors: string[] = finalError;

  return (
    <AuthFormContainer title="Create New Account" onSubmit={handleSubmit}>
      <Input
        name="name"
        label="Name"
        onChange={handleChange}
        value={name}
        onBlur={handleBlur}
        color={touched.name && errors.name ? "red" : "black"}
      />
      <Input
        name="email"
        label="Email"
        onChange={handleChange}
        value={email}
        onBlur={handleBlur}
        color={touched.email && errors.email ? "red" : "black"}
      />
      <Input
        name="password"
        label="Password"
        type="password"
        onChange={handleChange}
        value={password}
        onBlur={handleBlur}
        color={touched.password && errors.password ? "red" : "black"}
      />
      <Button type="submit" className="w-full ">
        {isLoading ? (
          <div className="  flex items-center justify-center">
            <Spinner />
          </div>
        ) : (
          <>SignUp</>
        )}
      </Button>
      <div className="flex items-center justify-between">
        <Link href="/auth/signin">Sign in</Link>
        <Link href="/auth/forget-password">Forget password</Link>
      </div>

      <div className="">
        {formErrors.map(err => {
          return (
            <div key={err} className="space-x-1 flex items-center text-red-500">
              <XMarkIcon className="w-4 h-4" />
              <p className="text-xs">{err}</p>
            </div>
          );
        })}
      </div>
    </AuthFormContainer>
  );
}
