const Home = () => {
  return (
    <div className="flex flex-col justify-center items-center">
      <h1 className="text-3xl font-bold">Me_Chat</h1>
      <div className="text-red-500">
        <h2 className="text-xl font-bold text-red-500">** NOTE **</h2>
        <p>This is a beta version.</p>
        <p>
          Currently Forgot password option is not available. So please remeber
          your password
        </p>
        <p>
          Also there is no account delete option nor message/image/pdf delete
          option.
        </p>
      </div>

      <a href="/signUp">Sign Up</a>
      <a href="/login">Login</a>
    </div>
  );
};

export default Home;
