import React, { useState, useEffect } from "react";
import {
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Settings,
  Contact,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../slices/userslice";
import api from "../../src/utilities/api";
import ActionButtons from "./ActionButtons";

function ProblemNavBar({ setOpenSetting }) {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);

  let get_user = useSelector((state) => state.user);

  const dispatch = useDispatch();

  const fetchedUser = async () => {
    try {
      const res = await api.get("auth/user/");
      const data = res.data;
      setUser(data);
      dispatch(login(data));
    } catch (error) {}
  };

  useEffect(() => {
    if (!user) {
      fetchedUser();
    } else {
      setUser(get_user);
    }
  }, []);

  return (
    <nav className="bg-dark text-white shadow-md w-full ">
      {/* Top bar */}
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-12 ">
          {/* Logo + Arrows */}
          <div className="flex gap-2 items-center">
            <div className="text-xl font-bold">CodeSphere</div>
            <div className="hidden sm:block cursor-pointer rounded p-2 hover:bg-grey border border-grey">
              <ChevronLeft size={20} />
            </div>
            <div className="hidden sm:block cursor-pointer rounded p-2 hover:bg-grey border border-grey">
              <ChevronRight size={20} />
            </div>
          </div>

          {/* Center actions (Desktop only) */}

          <ActionButtons user={user} />

          {/* Desktop Links */}
          <div className="hidden md:flex space-x-6">
            <div
              className="cursor-pointer hover:text-yellow-400"
              onClick={() => setOpenSetting((pre) => !pre)}
            >
              <Settings />
            </div>
            <div className={`${user ? "hidden" : "block"}`}>
              <Link to="/user/login" className="hover:text-yellow-400">
                Login
              </Link>
              <Link to="/user/register" className="hover:text-yellow-400">
                Register
              </Link>
            </div>

            {user && (
              <div className="flex gap-2 items-center ">
                <span className="text-blue-400">
                  {" "}
                  <Contact size={22} />
                </span>
                <p className="text-sm text-yellow-400">
                  {user.first_name} {user.last_name}
                </p>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown with Animation */}
      <div
        className={`md:hidden bg-dark px-4 space-y-2 border-t border-grey overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-60 opacity-100 py-2" : "max-h-0 opacity-0"
        }`}
      >
        <Link to="/" className="block hover:text-yellow-400">
          Home
        </Link>
        <Link to="/problems" className="block hover:text-yellow-400">
          Problems
        </Link>
        <Link to="/about" className="block hover:text-yellow-400">
          About
        </Link>
        <div className={`${user ? "hidden" : "block"}`}>
          <Link to="/user/login" className="hover:text-yellow-400">
            Login
          </Link>
          <Link to="/user/register" className="hover:text-yellow-400">
            Register
          </Link>
        </div>

        {user && (
          <div className="flex gap-2 items-center ">
            <span className="text-blue-400">
              {" "}
              <Contact size={22} />
            </span>
            <p className="text-sm text-yellow-400">
              {user.first_name} {user.last_name}
            </p>
          </div>
        )}
      </div>
    </nav>
  );
}

export default ProblemNavBar;
