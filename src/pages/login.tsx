import { useState } from "react";
import { useRouter } from "next/router";
import Layout from "../components/Layout";
import Link from "next/link";

export const handleLoginSubmit = async (email: string, password: string) => {
  try {
    const response = await fetch("./api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) {
      throw new Error("Invalid email or password");
    }
    const { token, user } = await response.json();
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    return { success: true };
  } catch (error:any) {
    console.error(error);
    return { success: false, error: error.message };
  }
};

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const router = useRouter();

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    const { success, error } = await handleLoginSubmit(email, password);
    if (success) {
      router.push("/"); // Navigate to the dashboard page
    } else {
      setLoginError(error);
    }
  };

    return (
    <Layout>
      <div className="flex flex-col items-center min-h-screen py-20">
        <h1 className="text-2xl font-bold mb-4">Login</h1>
        {loginError && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
            role="alert"
          >
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{loginError}</span>
          </div>
        )}
        <form onSubmit={handleSubmit} className="w-full max-w-sm">
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
          <div className="mb-6">
            <label
              className="block text-gray-700 font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Sign In
            </button>
            <Link
              className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
              href="/forgot-password"
            >
              Forgot Password?
            </Link>
          </div>
        </form>
        <p className="mt-4 text-center">
          New user?{" "}
          <Link
            href="/register"
            className="text-blue-500 underline hover:text-blue-700"
          >
            Create an account
          </Link>
        </p>
      </div>
    </Layout>
  );
};

export default Login;


// import { useState } from "react";
// import Layout from "../components/Layout";
// import { useRouter } from "next/router";
// import Link from "next/link";

// const Login = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loginError, setLoginError] = useState("");

//   const router = useRouter();

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     try {
//       const response = await fetch("./api/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, password }),
//       });
//       if (!response.ok) {
//         throw new Error("Invalid email or password");
//       }
//       const { token, user } = await response.json();
//       localStorage.setItem("token", token);
//       localStorage.setItem("user", JSON.stringify(user));
//       router.push("/"); // Navigate to the dashboard page
//     } catch (error: any) {
//       console.error(error);
//       setLoginError(error.message);
//     }
//   };

//   return (
//     <Layout>
//       <div className="flex flex-col items-center min-h-screen py-20">
//         <h1 className="text-2xl font-bold mb-4">Login</h1>
//         {loginError && (
//           <div
//             className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
//             role="alert"
//           >
//             <strong className="font-bold">Error: </strong>
//             <span className="block sm:inline">{loginError}</span>
//           </div>
//         )}
//         <form onSubmit={handleSubmit} className="w-full max-w-sm">
//           <div className="mb-4">
//             <label
//               className="block text-gray-700 font-bold mb-2"
//               htmlFor="email"
//             >
//               Email
//             </label>
//             <input
//               className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//               id="email"
//               type="email"
//               placeholder="Email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//             />
//           </div>
//           <div className="mb-6">
//             <label
//               className="block text-gray-700 font-bold mb-2"
//               htmlFor="password"
//             >
//               Password
//             </label>
//             <input
//               className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//               id="password"
//               type="password"
//               placeholder="Password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//             />
//           </div>
//           <div className="flex items-center justify-between">
//             <button
//               className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
//               type="submit"
//             >
//               Sign In
//             </button>
//             <a
//               className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
//               href="#"
//             >
//               Forgot Password?
//             </a>
//           </div>
//         </form>
//         <p className="mt-4 text-center">
//           New user?{" "}
//           <Link
//             href="/register"
//             className="text-blue-500 underline hover:text-blue-700"
//           >
//             Create an account
//           </Link>
//         </p>
//       </div>
//     </Layout>
//   );
// };

// export default Login;
