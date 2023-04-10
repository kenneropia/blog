import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

function Navbar() {
  const { getUser, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  return (
    <nav className="bg-gray-200 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex md:flex-row flex-col justify-center items-center md:justify-between">
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold text-blue-700">
              Blog {location.pathname.includes("admin") && "- CMS"}
            </Link>
          </div>
          <div className="flex md:mt-0 mt-2 justify-center md:block">
            {getUser()?.role == "admin" ? (
              <div className="md:ml-10 flex items-baseline space-x-4">
                <Link
                  to="/admin/posts/create"
                  className="px-3 py-2 text-sm font-medium text-blue-700"
                >
                  Create Post
                </Link>
                <Link
                  to="/admin/posts"
                  className="px-3 py-2 text-sm font-medium  text-blue-700"
                >
                  Posts
                </Link>
                <Link
                  to="/admin/categories"
                  className="px-3 py-2 text-sm font-medium  text-blue-700"
                >
                  Categories
                </Link>
                <Link
                  to="/admin/tags"
                  className="px-3 py-2 text-sm font-medium  text-blue-700"
                >
                  Tags
                </Link>
                <button
                  onClick={() => {
                    logout();
                    navigate("/login");
                  }}
                  className="px-3 py-2 text-sm font-medium text-blue-700"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="md:ml-10 flex items-baseline space-x-4">
                <Link to="/" className="text-sm font-medium text-blue-700">
                  Posts
                </Link>
                <Link to="/login" className="text-sm font-medium text-blue-700">
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="text-sm font-medium text-blue-700"
                >
                  Signin
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
