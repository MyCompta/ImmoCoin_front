import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { resetPasswordFetch } from "../services/authApi";

const ResetPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();
  const navigate = useNavigate();
  const password = watch("password");
  const resetToken = new URLSearchParams(window.location.search).get(
    "reset_token"
  );

  const onSubmit = async (data) => {
    console.log(data);
    console.log("resetToken", resetToken);
    try {
      const response = await resetPasswordFetch(
        resetToken,
        data.password,
        data.passwordConfirmation
      );
      if (response.ok) {
        navigate(`/login`);
      } else {
        console.error("Reset password failed:", response);
      }
    } catch (error) {
      console.error("Error during reset password:", error.message);
    }
  };

  return (
    <div className="registerForm">
      <form onSubmit={handleSubmit(onSubmit)}>
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

        <input
          type="password"
          {...register("passwordConfirmation", {
            validate: (value) =>
              value === password || "The passwords do not match",
          })}
          placeholder="Confirm Password here"
          autoComplete="current-password"
        />
        {errors.passwordConfirmation && (
          <p>{errors.passwordConfirmation.message}</p>
        )}

        <input type="submit" />
      </form>
    </div>
  );
};

export default ResetPassword;
