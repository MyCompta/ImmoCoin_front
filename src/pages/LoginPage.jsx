import { Link } from "react-router-dom";
import LoginForm from "../components/LoginForm";

const LoginPage = () => {
  return (
    <div className="loginContainer" style={{ textAlign: "center" }}>
      <h1>Login</h1>
      <LoginForm />
      <p>
        You don&apos;t have an account ? <Link to={"/register"}>Register</Link>
      </p>
      <p>
        Forgot your password ? <Link to={"/forgot-password"}>Reset it</Link>
      </p>
    </div>
  );
};

export default LoginPage;
