import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/reducers/authReducer";
import reactLogo from "../assets/react.svg";
import { useEffect } from "react";

const Navbar = () => {
  const isLogged = useSelector((state) => state.auth.isLogged);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (Cookies.get("auth_token")) {
      Cookies.remove("auth_token");
      dispatch(logout());
      navigate(`/`);
    }
  };

  useEffect(() => {
    console.log(isLogged);
  }, [isLogged]);

  return (
    <div>
      <Link to={"/"}>
        <img src={reactLogo} alt="logo" />
      </Link>
      <Link to={"/"}>Home</Link>
      {isLogged === true ? (
        <a onClick={handleLogout}>Logout</a>
      ) : (
        <>
          <Link to={"/register"}>Register</Link>
          <Link to={"/login"}>Login</Link>
        </>
      )}
    </div>
  );
};

export default Navbar;
