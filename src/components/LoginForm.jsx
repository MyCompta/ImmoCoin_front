import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { loginFetch } from "../services/authApi";
import { useDispatch } from "react-redux";
import { login } from "../redux/reducers/authReducer";

import Cookies from "js-cookie";


const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const response = await loginFetch(data.email, data.password);
      if (response.headers) {
        const responseBody = await response.json();
        Cookies.set(
          "auth_token",
          JSON.stringify({
            token: response.headers.get("Authorization"),
            user_id: responseBody.user.id,
            email: responseBody.user.email,
          })
        );
        console.log(JSON.parse(Cookies.get("auth_token")));
        dispatch(login());
        navigate(`/`);
      }
    } catch (error) {
      console.error("Error during login:", error.message);
    }
  };

  return (
    <div className="loginForm">
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          type="email"
          {...register("email", {
            required: true,
            pattern: {
              value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
              message: "Invalid email address",
            },
          })}
          placeholder="Email here"
          autoComplete="current-email"
        />
        {errors.email && errors.email.type === "required" && (
          <p>Email can not be empty</p>
        )}
        {errors.email && errors.email.type === "pattern" && (
          <p>{errors.email.message}</p>
        )}

        <input
          type="password"
          {...register("password", {
            required: true,
            minLength: 6,
          })}
          placeholder="Password here"
          autoComplete="current-password"
        />
        {errors.password && errors.password.type === "required" && (
          <p>Password can not be empty</p>
        )}
        {errors.password && errors.password.type === "minLength" && (
          <p>Password should have 6 characters minimum</p>
        )}

        <input type="submit" />
      </form>
    </div>
  );
};

export default LoginForm;
