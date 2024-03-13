import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/reducers/authReducer";
import { useEffect, useState } from "react";
import "./Navbar.css";

const Navbar = () => {
  const isLogged = useSelector((state) => state.auth.isLogged);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const handleLogout = () => {
    if (Cookies.get("auth_token")) {
      Cookies.remove("auth_token");
      dispatch(logout());
      navigate(`/`);
    }
  };

  useEffect(() => {
    if (isMenuOpen) {
      window.addEventListener("click", (e) => {
        if (!document.querySelector(".navbar").contains(e.target)) {
          setIsMenuOpen(false);
        }
      });
    } else {
      window.removeEventListener("click", (e) => {
        if (!document.querySelector(".navbar").contains(e.target)) {
          setIsMenuOpen(false);
        }
      });
    }
  }, [isMenuOpen]);

  useEffect(() => {
    document.querySelectorAll(".navbar a").forEach((link) => {
      link.addEventListener("click", () => {
        setIsMenuOpen(false);
      });
    });
  });

  return (
    <nav className={"navbar" + (isMenuOpen ? " opened" : "")}>
      <div className="navbar__logo">
        <Link to={"/"}>
          <h1>ImmoCoin</h1>
        </Link>
      </div>
      <div
        className={"navbar__hamburger" + (isMenuOpen ? " opened" : "")}
        onClick={() => setIsMenuOpen(!isMenuOpen)}>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <div className="navbar__links">
        <Link to={"/"}>Home</Link>
        {isLogged === true ? (
          <>
            <Link to={"/properties"}>My properties</Link>
            <Link to={"/profile"}>Profile</Link>
            <Link to={"#"} onClick={handleLogout}>
              Logout
            </Link>
          </>
        ) : (
          <>
            <Link to={"/register"}>Register</Link>
            <Link to={"/login"}>Login</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
