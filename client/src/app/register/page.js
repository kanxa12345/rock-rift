"use client";
import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Link from "next/link";
import { Input } from "@nextui-org/react";
import { toast } from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { useRouter } from "next/navigation";

const SignupSchema = Yup.object().shape({
  fullName: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Required"),
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string()
    .required("Required")
    .matches(/[A-Z]/, "Must Contain One Uppercase character"),
  rePassword: Yup.string()
    .required("Required")
    .oneOf([Yup.ref("password")], "Passwords does not match"),
});

const Register = () => {
  const router = useRouter();
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showReSignupPassword, setShowReSignupPassword] = useState(false);

  const handleRegister = async (values) => {
    try {
      const response = await fetch( `${process.env.NEXT_PUBLIC_API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const result = await response.json();
      if (response.status === 201) {
        toast.success(result.msg);
        router.push("/login");
      } else {
        toast.error(result.msg);
      }
    } catch (err) {
      toast.error("Failed to register!");
    }
  };

  const { handleSubmit, resetForm, handleChange, values, errors, touched } =
    useFormik({
      initialValues: {
        fullName: "",
        email: "",
        password: "",
        rePassword: "",
      },
      validationSchema: SignupSchema,
      onSubmit: (values) => {
        handleRegister(values);
        resetForm();
      },
    });

  return (
    <div className="w-full h-screen flex flex-col gap-8 justify-center items-center">
      <h1 className="text-2xl font-semibold">Signup</h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center gap-6 w-1/3"
      >
        <div className="flex w-full gap-4">
          <div className="flex flex-col items-start w-full">
            <Input
              type="text"
              name="fullName"
              variant="underlined"
              label="Full Name"
              value={values.fullName}
              onChange={handleChange}
            />
            <div className="w-full h-2">
              {errors?.fullName && touched?.fullName ? (
                <p className="text-sm text-brandColor font-medium">
                  {errors.fullName}
                </p>
              ) : null}
            </div>
          </div>
          <div className="flex flex-col items-start w-full gap-1">
            <Input
              type="email"
              name="email"
              variant="underlined"
              label="Email"
              value={values.email}
              onChange={handleChange}
            />
            <div className="w-full h-2">
              {errors?.email && touched?.email ? (
                <p className="text-sm text-brandColor font-medium">
                  {errors.email}
                </p>
              ) : null}
            </div>
          </div>
        </div>
        <div className="flex w-full gap-4">
          <div className="flex flex-col items-start w-full relative">
            <Input
              type={`${showSignupPassword ? "text" : "password"}`}
              name="password"
              variant="underlined"
              label="Enter Password"
              value={values.password}
              onChange={handleChange}
            />
            <div className="w-full h-2">
              {errors?.password && touched?.password ? (
                <p className="text-sm text-brandColor font-medium">
                  {errors.password}
                </p>
              ) : null}
            </div>
            {values.password.length > 0 && (
              <span
                onClick={() => setShowSignupPassword(!showSignupPassword)}
                className="flex justify-center items-center cursor-pointer w-[20px] h-[20px] rounded-full bg-gray-200 text-xs absolute top-1/2 -translate-y-1/2 right-2"
              >
                <FaEye
                  className={`${
                    showSignupPassword ? "inline-block" : "hidden"
                  }`}
                />
                <FaEyeSlash
                  className={`${
                    showSignupPassword ? "hidden" : "inline-block"
                  }`}
                />
              </span>
            )}
          </div>
          <div className="flex flex-col items-start w-full relative">
            <Input
              type={`${showReSignupPassword ? "text" : "password"}`}
              name="rePassword"
              variant="underlined"
              label="Re-Enter Password"
              value={values.rePassword}
              onChange={handleChange}
            />
            <div className="w-full h-2">
              {errors?.rePassword && touched?.rePassword ? (
                <p className="text-sm text-brandColor font-medium">
                  {errors.rePassword}
                </p>
              ) : null}
            </div>
            {values.rePassword.length > 0 && (
              <span
                onClick={() => setShowReSignupPassword(!showReSignupPassword)}
                className="flex justify-center items-center cursor-pointer w-[20px] h-[20px] rounded-full bg-gray-200 text-xs absolute top-1/2 -translate-y-1/2 right-2"
              >
                <FaEye
                  className={`${
                    showReSignupPassword ? "inline-block" : "hidden"
                  }`}
                />
                <FaEyeSlash
                  className={`${
                    showReSignupPassword ? "hidden" : "inline-block"
                  }`}
                />
              </span>
            )}
          </div>
        </div>
        <button type="submit" className="bg-thirdColor text-white py-1 px-2">
          Sign Up
        </button>
      </form>
      <p>
        Already have an account?{" "}
        <Link href="/login" className="text-red-600 font-medium underline">
          Login
        </Link>
      </p>
    </div>
  );
};

export default Register;
