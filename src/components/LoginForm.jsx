import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { loginFetch } from "../services/authApi";
import { useDispatch } from "react-redux";
import { login } from "../redux/reducers/authReducer";

import Cookies from "js-cookie";
import { useSetAtom } from "jotai";
import { errorAtom } from "../atom/errorAtom";

const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const setError = useSetAtom(errorAtom);

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
          }),
          {
            expires: 1,
          }
        );
        dispatch(login());
        navigate(`/properties/new`);
      }
    } catch (error) {
      setError("Error during login:", error.message);
      console.error("Error during login:", error.message);
    }
  };

  return (
    <div className="loginForm" style={{ textAlign: "left" }}>
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
          autoFocus
          className={errors.email ? "error" : ""}
        />
        {errors.email && errors.email.type === "required" && (
          <p className="error">Email can not be empty</p>
        )}
        {errors.email && errors.email.type === "pattern" && (
          <p className="error">{errors.email.message}</p>
        )}

        <input
          type="password"
          {...register("password", {
            required: true,
            minLength: 6,
          })}
          placeholder="Password here"
          autoComplete="current-password"
          className={errors.password ? "error" : ""}
        />
        {errors.password && errors.password.type === "required" && (
          <p className="error">Password can not be empty</p>
        )}
        {errors.password && errors.password.type === "minLength" && (
          <p className="error">Password should have 6 characters minimum</p>
        )}

        <input type="submit" />
      </form>
    </div>
  );
};

export default LoginForm;
