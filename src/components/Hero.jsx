import "./Hero.scss";
import { Link } from "react-router-dom";
import logo from "../assets/logo-no-background.svg";

const Hero = () => {
  return (
    <div className="heroContainer">
      <div className="content">
        <img src={logo} alt="logo" className="logo" />
        <h1>Find Your Ideal Home or Sell with Ease</h1>
        <h4>Welcome to ImmoCoin - the future of real estate starts here.</h4>
        <div className="buttons">
          <Link id="myBtn" to="/properties">
            Look for a Property
          </Link>
          <Link id="myBtn" to="/login">
            Sell a Property
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Hero;
