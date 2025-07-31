import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { auth } from "../../firebase/firebase";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import { useEffect, useState } from "react";

const errorMessages = {
  "auth/email-already-in-use": "This account already exist, login instead.",
  "auth/invalid-email": "Please enter a valid email address.",
  "auth/weak-password": "Password should be at least 6 characters.",
  "auth/user-not-found": "No account found with this email.",
  "auth/wrong-password": "Incorrect password. Please try again.",
  "auth/network-request-failed": "Network error. Please check your connection.",
};

export default function Signup() {
  const [loading, setLoading] = useState(false);
  const [firebaseError, setFirebaseError] = useState("");
  const schema = yup.object({
    email: yup.string().email("Invalid email").required("Email is required"),
    password: yup.string().min(8).max(12).required("Password is required"),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  async function onSubmit(data) {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      reset();
      console.log("User created:", userCredential.user);
    } catch (error) {
      const friendlyMessage =
        errorMessages[error.code] || "Something went wrong. Please try again.";

      setFirebaseError(friendlyMessage);
      console.error("Registration failed:", error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full mx-auto my-12 md:w-[40%] p-6 bg-white shadow rounded-lg space-y-6"
    >
      <div className="text-center">
        <h3 className="text-[1.75rem] mb-2">Welcome to LocalMart</h3>
        <p className="mb-8">
          Type your e-mail or phone number to log in or create an account.
        </p>

        <div className="space-y-2 text-left text-gray-800 mb-6">
          <label>Email</label>
          <input
            {...register("email")}
            className="input"
            placeholder="Enter email or phone number"
            type="text"
          />
          {errors.email?.message ? (
            <p className="text-[0.875rem] text-red-600">
              {errors.email?.message}
            </p>
          ) : (
            firebaseError && (
              <p className="text-[0.875rem] text-red-600">{firebaseError}</p>
            )
          )}
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
        <p className="text-left mb-12">
          Already have an accout?
          <span className="ml-1 text-[#009688] font-semibold hover:text-style-underline cursor-pointer">
            Login
          </span>
        </p>
        <button
          type="submit"
          disabled={loading}
          className="w-full px-5 py-3 bg-gradient-to-r from-[#009688] to-[#00695C] text-[#fff] flex items-center justify-center rounded-lg"
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
                stroke="currentColor"
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
      </div>
    </form>
  );
}
