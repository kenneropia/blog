import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function Signup() {
  const [form, setForm] = useState({
    email: "",
    name: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.getUser()) {
      navigate("/login");
    }
  }, []);

  const handleClick = async (e: any) => {
    e.preventDefault();

    try {
      await auth.signup(form);
      toast.success("Signup successful");
      setErrorMessage("");
      navigate("/login");
    } catch (error: any) {
      setErrorMessage(error.response.data.message);
    }
  };

  return (
    <div className="flex items-center justify-center w-full p-4 bg-white">
      <div className="flex-col items-center w-full max-w-screen-md p-3 pt-5 m-4 mx-auto my-10 mt-20 bg-white border-2 shadow-md md:w-6/12">
        <p className="inline-flex w-full text-lg">Create an account.</p>
        <form className="space-y-5 mt-2 flex flex-col items-start w-full">
          <div className="w-full">
            <label className="block w-full" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              className="w-full border rounded p-2 outline-2"
              onChange={(e) =>
                setForm((prev) => {
                  return { ...prev, email: e.target.value.trim() };
                })
              }
              value={form.email}
              id="email"
              name="email"
              placeholder="Email"
            />
          </div>
          <div className="w-full">
            <label className="block w-full" htmlFor="name">
              Name
            </label>
            <input
              className="w-full border rounded p-2 outline-2"
              onChange={(e) =>
                setForm((prev) => {
                  return { ...prev, name: e.target.value.trim() };
                })
              }
              type="text"
              value={form.name}
              id="name"
              placeholder="Name"
              name="name"
            />
          </div>
          <div className="w-full">
            <label className="block w-full" htmlFor="password">
              Password
            </label>
            <input
              className="w-full border rounded p-2 outline-2"
              onChange={(e) =>
                setForm((prev) => {
                  return { ...prev, password: e.target.value.trim() };
                })
              }
              type="password"
              minLength={8}
              value={form.password}
              id="password"
              placeholder="Password"
              name="password"
            />
          </div>
          <div className="w-full">
            <p className="text-xs font-light">
              Password must be at least 8 characters.
            </p>
          </div>
          {errorMessage && (
            <p className="text-red-500 text-sm font-medium">{errorMessage}</p>
          )}
          <button
            onClick={handleClick}
            className="border rounded px-4 py-2 text-white bg-blue-700"
            disabled={
              (!form.email && true) ||
              (!form.name && true) ||
              (!form.password && true)
            }
            type="submit"
          >
            Sign up
          </button>
        </form>
      </div>
    </div>
  );
}
