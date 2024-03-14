import { Link } from "react-router-dom";
import RegisterForm from "../components/RegisterForm";

const RegisterPage = () => {
  return (
    <div className="registerContainer" style={{ textAlign: "center" }}>
      <h1>Register</h1>
      <RegisterForm />
      <p>
        You already have an account ? <Link to={"/login"}>Login</Link>
      </p>
    </div>
  );
};

export default RegisterPage;
