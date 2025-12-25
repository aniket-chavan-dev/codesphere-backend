import { useState } from "react";
import { login } from "../slices/userslice";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const navigater = useNavigate();

  const loginHandler = async () => {
    setIsLoading(true);
    const send_data = {
      email: email,
      password: password,
    };
    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/api/auth/user/login/",
        send_data
      );
      const resData = res.data;
      setError(null);
      const token = resData["access-token"];

      localStorage.setItem("token", token);

      dispatch(login(resData.user));

      navigater("/");

      window.location.reload();
    } catch (e) {
      if (e.response.data != undefined && typeof e.response.data === "object") {
        setError(e.response.data);
        console.log(error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark text-white px-4">
      {" "}
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        {" "}
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>{" "}
        <form className="space-y-4">
          {" "}
          <div>
            {" "}
            <label className="block mb-1">Email</label>{" "}
            <input
              type="email"
              className="w-full px-3 py-2 rounded bg-gray-700 focus:outline-none"
              onChange={(e) => setEmail(e.target.value)}
            />{" "}
            <p className="text-sm text-red-900">
              {error != null && "email" in error ? error.email : ""}
            </p>
          </div>{" "}
          <div>
            {" "}
            <label className="block mb-1">Password</label>{" "}
            <input
              type="password"
              className="w-full px-3 py-2 rounded bg-gray-700 focus:outline-none"
              onChange={(e) => setPassword(e.target.value)}
            />{" "}
            <p className="text-sm text-red-900">
              {error != null && "password" in error ? error.password : ""}
            </p>
          </div>{" "}
          <button
            type="button"
            className={
              "w-full py-2 bg-yellow-500 hover:bg-yellow-600 rounded font-semibold"
            }
            onClick={loginHandler}
          >
            {" "}
            {isLoading ? "Logging... " : "Login"}
          </button>{" "}
        </form>{" "}
        <p className="text-center mt-4 text-sm">
          {" "}
          Don’t have an account?{" "}
          <Link to="/user/register" className="text-yellow-400 hover:underline">
            Register
          </Link>{" "}
        </p>{" "}
        <p className="text-sm text-red-500 text-center">
          {" "}
          {error != null && "msg" in error ? error.msg : ""}
        </p>
      </div>{" "}
    </div>
  );
}
