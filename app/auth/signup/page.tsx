"use client";
import React from "react";
import AuthFormContainer from "@/components/authFormContainer";
import {Button, Input} from "@material-tailwind/react";
import {XMarkIcon} from "@heroicons/react/24/outline";
import {Formik, useFormik} from "formik";
import * as yup from "yup";

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
    onSubmit: values => {
      console.log(values);
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
      />
      <Input
        name="email"
        label="Email"
        onChange={handleChange}
        value={email}
        onBlur={handleBlur}
      />
      <Input
        name="password"
        label="Password"
        type="password"
        onChange={handleChange}
        value={password}
        onBlur={handleBlur}
      />
      <Button type="submit" className="w-full">
        Sign up
      </Button>
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
