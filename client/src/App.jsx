import React from "react";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Home from "./pages/Home.jsx";
import SignUp from "./pages/SignUp.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import User from "./pages/UserHome.jsx";
import MessageContact from "./components/MessageContact.jsx";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="signUp" element={<SignUp />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="user/:senderId" element={<User />}>
          <Route path=":receiverId" element={<MessageContact />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
