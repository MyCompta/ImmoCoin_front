import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { createPropertyFetch } from "../services/propertyApi";
import Cookies from "js-cookie";

const NewPropertyForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const imagesRef = useRef([]);

  const onSubmit = async (data) => {
    let authToken = {};
    const formData = new FormData();
    formData.append("property[title]", data.title);
    formData.append("property[price]", data.price);
    formData.append("property[description]", data.description);
    formData.append("property[location]", data.location);

    for (let i = 0; i < imagesRef.current.length; i++) {
      formData.append("property[images][]", imagesRef.current[i]);
    }

    if (!Cookies.get("auth_token")) {
      console.log("User is not logged in. Unable to create a property.");
      throw new Error("User is not logged in. Unable to create a property.");
    } else {
      authToken = JSON.parse(Cookies.get("auth_token"));
      formData.append("property[user_id]", authToken.user_id);
    }

    try {
      console.log("formData", formData);
      const response = await createPropertyFetch(formData);

      if (response.ok) {
        const responseData = await response.json();
        navigate(`/properties/${responseData.id}`);
      }
    } catch (error) {
      console.error("Error during create property:", error.message);
    }
  };

  const handleFileChange = (e) => {
    imagesRef.current = e.target.files;
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
          {...register("location", {
            required: true,
          })}
          placeholder="Location here"
          autoComplete="current-location"
        />
        {errors.location && errors.location.type === "required" && (
          <p>Location can not be empty</p>
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
          name="image"
          multiple
          {...register("image")}
          onChange={handleFileChange}
        />

        <input type="submit" />
      </form>
    </div>
  );
};

export default NewPropertyForm;
