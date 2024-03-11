import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoutes = () => {
  const isLogged = useSelector((state) => state.auth.isLogged);

  console.log(isLogged);
  return isLogged ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoutes;
