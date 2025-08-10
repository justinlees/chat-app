import { useState } from "react";

const ForgotPassword = () => {
  const [otp, setOTP] = useState();
  const [email, setEmail] = useState("");
  const sendOTP = async (e) => {
    e.preventDefault();
    const Email = email;
  };
  return (
    <div>
      <form onSubmit={sendOTP}>
        <input
          type="email"
          placeholder="Enter your Email"
          name="Email"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          required
        />
        <button type="submit">Send OTP</button>
        <input type="number" name="otp" required />
      </form>
    </div>
  );
};

export default ForgotPassword;
