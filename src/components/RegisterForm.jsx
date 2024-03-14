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
          })
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
    <div className="registerForm">
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
        {errors.email && errors.email.type === "required" && <p>Email can not be empty</p>}
        {errors.email && errors.email.type === "pattern" && <p>{errors.email.message}</p>}
        <input
          type="password"
          {...register("password", {
            required: true,
            minLength: 6,
          })}
          placeholder="Password here"
          autoComplete="current-password"
        />
        {errors.password && errors.password.type === "required" && <p>Password can not be empty</p>}
        {errors.password && errors.password.type === "minLength" && (
          <p>Password should have 6 characters minimum</p>
        )}
        <input
          type="password"
          {...register("passwordConfirmation", {
            validate: (value) => value === password || "The passwords do not match",
          })}
          placeholder="Confirm Password here"
          autoComplete="current-password"
        />
        {errors.passwordConfirmation && <p>{errors.passwordConfirmation.message}</p>}
        <input
          type="checkbox"
          {...register("cguvalidation", {
            required: "You must validate CGV",
          })}
          checked={checkboxCGV}
          onChange={(e) => {
            setCheckboxCGV(e.target.checked);
          }}
        />
        I have read and agree to the <Link to={"/cgv"}>CGV</Link>
        {errors.cguvalidation && <p>{errors.cguvalidation.message}</p>}
        <br></br>
        <input type="submit" />
      </form>
    </div>
  );
};

export default RegisterForm;
