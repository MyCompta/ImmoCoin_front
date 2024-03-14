import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { resetPasswordFetch } from "../services/authApi";
import { useSetAtom } from "jotai";
import { errorAtom } from "../atom/errorAtom";

const ResetPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();
  const navigate = useNavigate();
  const password = watch("password");
  const resetToken = new URLSearchParams(window.location.search).get("reset_token");
  const setError = useSetAtom(errorAtom);

  const onSubmit = async (data) => {
    try {
      const response = await resetPasswordFetch(
        resetToken,
        data.password,
        data.passwordConfirmation
      );
      if (response.ok) {
        navigate(`/login`);
      } else {
        setError("Reset password failed:", response);
        console.error("Reset password failed:", response);
      }
    } catch (error) {
      setError("Error during reset password:", error.message);
      console.error("Error during reset password:", error.message);
    }
  };

  return (
    <div className="registerForm" style={{ textAlign: "left" }}>
      <form onSubmit={handleSubmit(onSubmit)}>
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

        <input type="submit" />
      </form>
    </div>
  );
};

export default ResetPassword;
