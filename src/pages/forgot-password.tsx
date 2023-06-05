import { useState } from "react";
import Layout from "../components/Layout";

export const handleForgotPasswordSubmit = async (email: string) => {
  try {
    const response = await fetch("./api/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    if (!response.ok) {
      throw new Error(
        "Unable to process request at this time. Please try again later."
      );
    }
    return { success: true };
  } catch (error: any) {
    console.error(error);
    return { success: false, error: error.message };
  }
};

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState(false);
  const [forgotPasswordError, setForgotPasswordError] = useState("");

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    const { success, error } = await handleForgotPasswordSubmit(email);
    if (success) {
      setForgotPasswordSuccess(true);
    } else {
      setForgotPasswordError(error);
    }
  };

  return (
    <Layout>
      <div className="flex flex-col items-center min-h-screen py-20">
        <h1 className="text-2xl font-bold mb-4">Forgot Password</h1>
        {forgotPasswordSuccess ? (
          <div
            className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative"
            role="alert"
          >
            <strong className="font-bold">Success: </strong>
            <span className="block sm:inline">
              A link to reset your password has been sent to your email address.
            </span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="w-full max-w-sm">
            {forgotPasswordError && (
              <div
                className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
                role="alert"
              >
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">{forgotPasswordError}</span>
              </div>
            )}
            <div className="mb-4">
              <label
                className="block text-gray-700 font-bold mb-2"
                htmlFor="email"
              >
                Email
              </label>
              <input
                className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Submit
            </button>
          </form>
        )}
      </div>
    </Layout>
  );
};

export default ForgotPassword;
