import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { createPropertyFetch } from "../services/propertyApi";
import Cookies from "js-cookie";

const NewPropertyForm = () => {
  const {
    register,
    handleSubmit,
    //setValue,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    let authToken = {};

    if (!Cookies.get("auth_token")) {
      console.log("User is not logged in. Unable to create a property.");
      throw new Error("User is not logged in. Unable to create a property.");
    } else {
      authToken = JSON.parse(Cookies.get("auth_token"));
    }
    console.log("images", data.images);
    try {
      const response = await createPropertyFetch(
        data.title,
        data.price,
        data.description,
        data.location,
        data.images,
        authToken.id
      );

      if (response.ok) {
        const responseData = await response.json();
        navigate(`/properties/${responseData.id}`);
      }
    } catch (error) {
      console.error("Error during create property:", error.message);
    }
  };

  return (
    <div className="newPropertyForm">
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          type="text"
          {...register("title", {
            required: true,
          })}
          placeholder="Title here"
          autoComplete="current-title"
        />
        {errors.title && errors.title.type === "required" && (
          <p>Title can not be empty</p>
        )}

        <input
          type="number"
          {...register("price", {
            required: true,
          })}
          placeholder="Price here"
          autoComplete="current-price"
        />
        {errors.price && errors.price.type === "required" && (
          <p>Price can not be empty</p>
        )}

        <input
          type="text"
          {...register("description", {
            required: true,
          })}
          placeholder="Description here"
          autoComplete="current-description"
        />
        {errors.description && errors.description.type === "required" && (
          <p>Description can not be empty</p>
        )}

        <input
          type="file"
          accept="image/*"
          multiple
          {...register("images", {
            validate: (files) => {
              const areAllImages = Array.from(files).every((file) =>
                file.type.startsWith("image/")
              );
              return areAllImages || "Selected files must be images";
            },
          })}
          onChange={(e) => {
            // Utilisez setValue pour mettre à jour la valeur du champ "images"
            const files = Array.from(e.target.files);
            //setValue("images", files);
          }}
        />

        <input type="submit" />
      </form>
    </div>
  );
};

export default NewPropertyForm;
