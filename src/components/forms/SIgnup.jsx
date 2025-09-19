import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { signInWithGoogle } from "../../firebase/firebase";

import { useEffect, useState } from "react";
import { supabase } from "../../supabase-client";
import { redirect, useLocation, Link } from "react-router-dom";

const errorMap = {
  PGRST302: "Invalid credentials. Please check your email or password.",
  PGRST301: "Check email or password and try again.",
  PGRST303: "Your session has expired. Please log in again.",
  PGRST304: "Permission denied. You do not have access to this resource.",
  PGRST305: "Please wait and try again later.",
  PGRST307: "Invalid email format.",
  PGRST308: "Password is too weak. Please use a stronger password.",
};

export default function Signup() {
  const location = useLocation();
  const redirectTo = location.state?.redirectTo || "/";

  const [loading, setLoading] = useState(false);
  const [firebaseError, setFirebaseError] = useState("");
  const { login } = AuthProvider();

  const schema = yup.object({
    email: yup.string().email("Invalid email").required("Email is required"),
    password: yup.string().min(8).max(12).required("Password is required"),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ resolver: yupResolver(schema) });

  async function onSubmit(formData) {
    try {
      setLoading(false);
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        console.error("Error signing up:", error.message);
        const friendlyMessage =
          errorMap[error.code] || "Something went wrong. Please try again.";

        setFirebaseError(friendlyMessage);
        setLoading(true);
        return;
      }

      console.log("User signed up:", data);
      reset();
    } catch (err) {
      console.error("Registration failed:", err.message);
      console.error("Unexpected error during signup:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full mx-auto my-12 md:w-[40%] p-6 bg-white shadow rounded-lg text-center">
      <h3 className="text-[1.75rem]">Welcome to LocalMart</h3>
      <p className="mb-16">
        Type your e-mail or phone number to log in or create an account.
      </p>
      <button
        onClick={signInWithGoogle}
        className="flex items-center  justify-center hover:bg-[#F4F4F4] hover:border-transparent gap-4 w-full py-3 px-4 border-[1px] border-[#cecece] rounded-[8px] mb-8"
      >
        <svg
          width="24"
          height="23"
          viewBox="0 0 21 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g fill="none" fillRule="evenodd">
            <path
              d="M20.3081 10.2303C20.3081 9.55056 20.253 8.86711 20.1354 8.19836H10.7031V12.0492H16.1046C15.8804 13.2911 15.1602 14.3898 14.1057 15.0814V17.5078H17.3282C19.2205 15.7397 20.3081 13.2049 20.3081 10.2303Z"
              fill="#4285F4"
            ></path>
            <path
              d="M10.7031 20C13.3989 20 15.6734 19.1151 17.3282 17.5078L14.1057 15.0814C13.2421 15.6697 12.1618 16.0226 10.7031 16.0226C8.09416 16.0226 5.88063 14.2407 5.09702 11.9375H1.76562V14.4297C3.46328 17.7968 6.92187 20 10.7031 20Z"
              fill="#34A853"
            ></path>
            <path
              d="M5.09702 11.9375C4.90312 11.3492 4.79687 10.7258 4.79687 10.0851C4.79687 9.44444 4.90312 8.82097 5.09702 8.23264V5.74039H1.76562C1.11328 7.03226 0.742188 8.51613 0.742188 10.0851C0.742188 11.6541 1.11328 13.1379 1.76562 14.4297L5.09702 11.9375Z"
              fill="#FBBC05"
            ></path>
            <path
              d="M10.7031 4.04762C12.2873 4.04762 13.7175 4.66667 14.8254 5.73016L17.6649 2.89058C15.6687 1.00808 13.3942 0 10.7031 0C6.92187 0 3.46328 2.20323 1.76562 5.5704L5.09702 8.06266C5.88063 5.75937 8.09416 4.04762 10.7031 4.04762Z"
              fill="#EA4335"
            ></path>
          </g>
        </svg>
        Sign in with Google
      </button>

      <div className="w-full flex items-center gap-1 mb-8">
        <hr className="w-[50%] border-[1px] border-[#CACACA] rounded-full" />
        <span className="text-[1.125rem]">or</span>
        <hr className="w-[50%] border-[1px] border-[#CACACA] rounded-full" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="">
        <div className="text-center">
          <div className="space-y-2 text-left text-gray-800 mb-6">
            <label>Email</label>
            <input
              {...register("email")}
              className="input"
              placeholder="Enter email or phone number"
              type="text"
            />

            <p className="text-[0.875rem] text-red-600">
              {errors.email?.message}
            </p>
          </div>

          <div className="space-y-2 text-left text-gray-800 mb-4">
            <label>Password</label>
            <input
              {...register("password")}
              className="input"
              placeholder="Enter Password"
              type="password"
            />
            {errors.password?.message ? (
              <p className="text-[0.875rem] text-red-600">
                {errors.password.message}
              </p>
            ) : (
              firebaseError && (
                <p className="text-[0.875rem]  text-red-600">{firebaseError}</p>
              )
            )}
          </div>
          <p className=" mb-12">
            Already have an accout?
            <Link
              to="/login"
              onClick={() => handleSubmit(login)}
              className="ml-1 text-[#009688] font-semibold hover:text-style-underline cursor-pointer"
            >
              Login
            </Link>
          </p>
          <button
            type="submit"
            disabled={loading}
            className="w-full px-5 py-3 bg-gradient-to-r from-[#009688] to-[#00695C] transition-all duration-200
    hover:from-[#00897B] hover:to-[#005B4F] text-[#fff] flex items-center justify-center mb-2 rounded-lg"
          >
            {loading ? (
              <svg
                className="animate-spin h-5 w-5 mr-2 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="#fff"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
                ></path>
              </svg>
            ) : (
              "Continue"
            )}
          </button>
          <p className="text-[0.875rem]">
            By continuing you agree to LocalMart's
            <a className="text-[#009688] underline">Terms and Conditions</a>
          </p>
        </div>
      </form>
    </div>
  );
}
