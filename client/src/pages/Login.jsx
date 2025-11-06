import { useEffect, useState } from "react";

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const checkToken = async (e) => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `${import.meta.env.VITE_BASE_URL || "http://localhost:5000"}/login`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );
        const data = await response.json();
        if (data.message === "User Token exist") {
          setIsLoading(false);
          window.location.href = `/user/${data.user._id}`;
        }
      } catch (error) {
        alert("Server Error");
      }
    };

    checkToken();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loginUser = {
      email: e.target.Email.value,
      password: e.target.Password.value,
    };
    setIsLoading(true);
    const response = await fetch(
      `${import.meta.env.VITE_BASE_URL || "http://localhost:5000"}/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginUser),
        credentials: "include",
      }
    );
    const data = await response.json();
    if (data.message === "Login success") {
      setIsLoading(false);
      window.location.href = `/user/${data.user._id}`;
    } else {
      setIsLoading(false);
      alert(data.message);
      window.location.href = "/login";
    }
    e.target.reset();
  };

  if (isLoading)
    return (
      <div className="loadPage">
        <span className="mainLoader"></span>
      </div>
    );
  else
    return (
      <div className="flex flex-col items-center justify-center h-screen ">
        <h1 className="text-3xl mb-2 font-bold">Login</h1>
        <form
          className="flex flex-col item-center justify-evenly gap-5 bg-gray-800 p-12 rounded h-1/2 "
          method="POST"
          onSubmit={handleSubmit}
        >
          <input
            className="border border-gray-300 rounded p-2 text-gray-100 w-72"
            type="email"
            placeholder="Enter your Email"
            name="Email"
            required
          />
          <input
            className="border border-gray-300 rounded p-2 text-gray-100"
            type="password"
            placeholder="Enter your password"
            name="Password"
            required
          />
          <button
            type="submit"
            className="text-white hover:bg-gray-600 p-2 rounded cursor-pointer"
          >
            Login
          </button>
          <p className="text-gray-400">
            Don't have an account?
            <a href="signUp" className="cursor-pointer">
              Register
            </a>
          </p>
          <a href="forgot-password" className="cursor-pointer text-gray-400">
            Forgot Password?
          </a>
        </form>
      </div>
    );
};

export default Login;
