import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { getPropertyFetch, updatePropertyFetch } from "../services/propertyApi";
import Cookies from "js-cookie";

const EditPropertyForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [property, setProperty] = useState();
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const fetchedProperty = await getPropertyFetch(id);
        setProperty(fetchedProperty);
      } catch (error) {
        console.error("Error during get property:", error.message);
      }
    };
    fetchProperty();
  }, []);

  const onSubmit = async (data) => {
    let authToken = {};

    if (!Cookies.get("auth_token")) {
      throw new Error("User is not logged in. Unable to edit the property.");
    } else {
      authToken = JSON.parse(Cookies.get("auth_token"));
    }

    try {
      const response = await updatePropertyFetch(
        data.title,
        data.price,
        data.description,
        data.location,
        id
      );

      if (response.ok) {
        navigate(`/properties/${id}`);
      }
    } catch (error) {
      console.error("Error during create property:", error.message);
    }
  };

  return (
    property && (
      <div className="newPropertyForm">
        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            type="text"
            {...register("title", {
              required: true,
            })}
            placeholder="Title here"
            autoComplete="current-title"
            defaultValue={property.title}
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
            defaultValue={property.price}
          />
          {errors.price && errors.price.type === "required" && (
            <p>Price can not be empty</p>
          )}

          <input
            type="string"
            {...register("location", {
              required: true,
            })}
            placeholder="location here"
            autoComplete="current-location"
            defaultValue={property.location}
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
            defaultValue={property.description}
          />
          {errors.description && errors.description.type === "required" && (
            <p>Description can not be empty</p>
          )}

          <input type="submit" />
        </form>
      </div>
    )
  );
};

export default EditPropertyForm;
