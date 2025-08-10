import { useState } from "react";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobile, setMobile] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(`http://localhost:5000/signUp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
        mobile,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message === "User created successfully") {
          alert("User created successfully");
          window.location.href = `/user/${data.user._id}`;
        }
        if (data.message === "User already exists") {
          alert("User already exists");
        }
        if (data.message === "All fields are required") {
          alert("All fields are required");
        }
        if (data.message === "Password must be of at least 6 characters") {
          alert("Password must be of at least 6 characters");
        }

        if (data.message === "User creation failed") {
          alert("User creation failed");
        }

        if (data.message === "Internal server error") {
          alert("Internal server error");
        }
      });
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl mb-2 font-bold">SignUp</h1>
      <form
        className="flex flex-col item-center gap-6 bg-gray-800 p-12 rounded "
        method="POST"
        // // action={`http://localhost:${process.env.PORT || 5000}/signUp`}
        // action="/signUp"
        onSubmit={handleSubmit}
      >
        <input
          className="border border-gray-300 rounded p-2 text-gray-100 w-72"
          type="text"
          placeholder="Enter your Full Name"
          name="name"
          required
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
        <input
          className="border border-gray-300 rounded p-2 text-gray-100 w-72"
          type="email"
          placeholder="Enter your Email"
          name="email"
          required
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
        <input
          className="border border-gray-300 rounded p-2 text-gray-100 w-72"
          type="password"
          placeholder="Enter your Password"
          name="password"
          required
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <input
          className="border border-gray-300 rounded p-2 text-gray-100 w-72"
          type="tel"
          placeholder="Enter your Mobile Number"
          name="mobile"
          required
          onChange={(e) => {
            setMobile(e.target.value);
          }}
        />
        <button
          type="submit"
          className="text-white hover:bg-gray-600 p-2 rounded cursor-pointer"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default SignUp;
