import { useEffect, useState } from "react";
import { Menu, X, Contact } from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../slices/userslice";
import api from "../../src/utilities/api";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
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
    fetchedUser();
  }, []);
  return (
    <nav className="bg-dark text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="text-2xl font-bold">CodeSphere</div>

          {/* Desktop Links */}
          <div className="hidden md:flex space-x-6">
            <Link to="/" className="hover:text-yellow-400">
              Home
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

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="hidden md:flex space-x-6">
          <Link to="/" className="hover:text-yellow-400">
            Home
          </Link>
          <Link to="/problems" className="hover:text-yellow-400">
            Problems
          </Link>
          <Link to="/about" className="hover:text-yellow-400">
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
      )}
    </nav>
  );
}
