import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState(false);
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.getUser()) {
      navigate("/");
    }
  }, []);

  const handleClick = async (e: any) => {
    e.preventDefault();

    if (form.email && form.password) {
      await auth.login(form);
      toast.success("Login successful");
      setErrorMessage(false);
      navigate("/");
    }
  };
  return (
    <div className="flex items-center justify-center w-full p-4 bg-white">
      <div className="flex-col items-center w-full max-w-screen-md p-3 pt-5 m-4 mx-auto my-10 mt-20 bg-white border-2 shadow-md md:w-6/12">
        <p className="inline-flex w-full text-lg ">Log into your account.</p>
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
              id="Email"
              name="email"
              placeholder="Email"
            />
          </div>
          <div className="w-full">
            <label className="block w-full" htmlFor="password">
              Password
            </label>
            <input
              className="w-full border rounded p-2 outline-2 "
              onChange={(e) =>
                setForm((prev) => {
                  return { ...prev, password: e.target.value.trim() };
                })
              }
              type="text"
              minLength={8}
              value={form.password}
              id="password"
              placeholder="password"
              name="password"
            />
          </div>

          {/* <FormControl isInvalid={errorMessage}>
            <FormErrorMessage color={"red"}>{errorMessage}</FormErrorMessage>
          </FormControl> */}
          <button
            onClick={handleClick}
            className="border rounded px-4 py-2 text-white bg-blue-700"
            disabled={(!form.email && true) || (!form.password && true)}
            type="submit"
          >
            Submit
          </button>
        </form>
        <p className="text-xs font-light">
          email is aaron@kenny.com and password is 12345678
        </p>
      </div>
    </div>
  );
}

export default Login;
