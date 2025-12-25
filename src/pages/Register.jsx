import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios'



export default function Register() {

    const [firstName,setFirstName] = useState("");
    const [LastName,setLastName] = useState("");
    const [userName,setUserName] = useState("");
    const [password,setPassword] = useState("");
    const [email,setEmail] = useState("");
    const [collageName,setCollageName] = useState("");

    const [error,setError] = useState(null);
    const [isLoading,setIsLoading] = useState(false);


    const navigater = useNavigate()

    const registerHandler =  async () => {
        setIsLoading(true)
        const data = {
            first_name : firstName,
            last_name : LastName,
            email : email,
            password : password,
            collage_name : collageName,
            username : userName
        }

        try {
             const res = await axios.post("http://127.0.0.1:8000/api/auth/user/ragister/",data);
             console.log(res.data);
             setError(null);
             navigater("/user/login")
        } catch(e) {
           if(typeof e.response.data === "object") {
             setError(e.response.data)
             console.log(error)
           }
        } finally {
            setIsLoading(false)
        }
       
    }


  return (
    <div className="min-h-screen flex items-center justify-center bg-dark text-white px-4">
      {" "}
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        {" "}
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>{" "}
        <form className="space-y-4">
          {" "}
          <div>
            {" "}
            <label className="block mb-1">First Name</label>{" "}
            <input
              type="text"
              className="w-full px-3 py-2 rounded bg-gray-700 focus:outline-none"
              onChange={(e) => setFirstName(e.target.value)}
            />{" "}
             <p className="text-sm text-red-900">{error != null && "first_name" in error ? error.first_name : ""}</p>
          </div>{" "}
          <div>
            {" "}
            <label className="block mb-1">Last Name</label>{" "}
            <input
              type="text"
              className="w-full px-3 py-2 rounded bg-gray-700 focus:outline-none"
              onChange={(e) => setLastName(e.target.value)}
            />{" "}
            <p className="text-sm text-red-900">{error != null && "last_name" in error ? error.last_name : ""}</p>
          </div>{" "}
          <div>
            {" "}
            <label className="block mb-1">Username</label>{" "}
            <input
              type="text"
              className="w-full px-3 py-2 rounded bg-gray-700 focus:outline-none"
              onChange={(e) => setUserName(e.target.value)}
            />{" "}
            <p className="text-sm text-red-900">{error != null && "username" in error ? error.username : ""}</p>
          </div>{" "}
          <div>
            {" "}
            <label className="block mb-1">Password</label>{" "}
            <input
              type="password"
              className="w-full px-3 py-2 rounded bg-gray-700 focus:outline-none"
              onChange={(e) => setPassword(e.target.value)}
            />{" "}
            <p className="text-sm text-red-900">{error != null && "password" in error ? error.password : ""}</p>
          </div>{" "}
          <div>
            {" "}
            <label className="block mb-1">College Name</label>{" "}
            <input
              type="text"
              className="w-full px-3 py-2 rounded bg-gray-700 focus:outline-none"
              onChange={(e) => setCollageName(e.target.value)}
            />{" "}
             <p className="text-sm text-red-900">{error != null && "collage_name" in error ? error.collage_name : ""}</p>
          </div>{" "}
          <div>
            {" "}
            <label className="block mb-1">Email Address</label>{" "}
            <input
              type="email"
              className="w-full px-3 py-2 rounded bg-gray-700 focus:outline-none"
              onChange={(e) => setEmail(e.target.value)}
            />{" "}
             <p className="text-sm text-red-900">{error != null && "email" in error ? error.email : ""}</p>
          </div>{" "}
          <button
            type="button"
            className="w-full py-2 bg-yellow-500 hover:bg-yellow-600 rounded font-semibold"
            onClick={registerHandler}
          >
            {" "}
            {isLoading ? "registering....." : "register"}
          </button>{" "}
        </form>{" "}
        <p className="text-center mt-4 text-sm">
          {" "}
          Already have an account?{" "}
          <Link to="/user/login" className="text-yellow-400 hover:underline">
            {" "}
            Login{" "}
          </Link>{" "}
        </p>{" "}
      </div>{" "}
    </div>
  );
}
