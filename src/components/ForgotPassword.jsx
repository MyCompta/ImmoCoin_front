import { useForm } from "react-hook-form";
import { forgotPasswordFetch } from "../services/authApi";
import { useSetAtom } from "jotai";
import { errorAtom } from "../atom/errorAtom";

const ForgotPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const setError = useSetAtom(errorAtom);

  const onSubmit = async (data) => {
    try {
      await forgotPasswordFetch(data.email);
    } catch (error) {
      setError("Error during forgot password:", error.message);
      console.error("Error during forgot password:", error.message);
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
          className={errors.email ? "error" : ""}
        />
        {errors.email && errors.email.type === "required" && (
          <p className="error">Email can not be empty</p>
        )}
        {errors.email && errors.email.type === "pattern" && (
          <p className="error">{errors.email.message}</p>
        )}

        <input type="submit" />
      </form>
    </div>
  );
};

export default ForgotPassword;
