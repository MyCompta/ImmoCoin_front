import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { registerFetch } from "../services/authApi";
import { useDispatch } from "react-redux";
import { login } from "../redux/reducers/authReducer";
import Cookies from "js-cookie";
import { useSetAtom } from "jotai";
import { errorAtom } from "../atom/errorAtom";

const RegisterForm = () => {
  const [checkboxCGV, setCheckboxCGV] = useState("");
  const setError = useSetAtom(errorAtom);
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const password = watch("password");

  const onSubmit = async (data) => {
    try {
      const response = await registerFetch(data.email, data.password);
      const responseBody = await response.json();
      if (response.headers) {
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
        navigate(`/`);
      }
    } catch (error) {
      setError("Error during register:", error.message);
      console.error("Error during register:", error.message);
    }
  };

  return (
    <div className="registerForm" style={{ textAlign: "left" }}>
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
        <input
          type="password"
          {...register("passwordConfirmation", {
            validate: (value) => value === password || "The passwords do not match",
          })}
          placeholder="Confirm Password here"
          autoComplete="current-password"
          className={errors.passwordConfirmation ? "error" : ""}
        />
        {errors.passwordConfirmation && (
          <p className="error">{errors.passwordConfirmation.message}</p>
        )}
        <div>
          <input
            type="checkbox"
            {...register("cguvalidation", {
              required: "You must validate CGV",
            })}
            checked={checkboxCGV}
            onChange={(e) => {
              setCheckboxCGV(e.target.checked);
            }}
            id="cguvalidation"
          />
          <label htmlFor="cguvalidation">
            I have read and agree to the <Link to={"/cgv"}>CGV</Link>
          </label>
        </div>
        {errors.cguvalidation && <p className="error">{errors.cguvalidation.message}</p>}
        <input type="submit" />
      </form>
    </div>
  );
};

export default RegisterForm;
