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
          {errors.title && errors.title.type === "required" && <p>Title can not be empty</p>}

          <input
            type="number"
            {...register("price", {
              required: true,
              valueAsNumber: true,
            })}
            placeholder="Price here"
            autoComplete="current-price"
            defaultValue={property.price}
          />
          {errors.price && errors.price.type === "required" && <p>Price can not be empty</p>}

          <input
            type="text"
            {...register("location", {
              required: true,
            })}
            placeholder="Location here"
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

          <input
            type="number"
            {...register("room", {
              required: true,
              valueAsNumber: true,
            })}
            min={0}
            step={1}
            placeholder="room"
            defaultValue={property.room}
          />
          {errors.room && errors.room.type === "required" && <p>Room number can not be empty</p>}

          <input
            type="number"
            {...register("floor", {
              required: true,
              valueAsNumber: true,
            })}
            min={-2}
            step={1}
            placeholder="floor"
            defaultValue={property.floor}
          />
          {errors.room && errors.room.type === "required" && <p>Floor number can not be empty</p>}

          <input
            type="number"
            {...register("surface", {
              required: true,
              valueAsNumber: true,
            })}
            min={8}
            step={1}
            placeholder="surface"
            defaultValue={property.surface}
          />
          {errors.surface && errors.surface.type === "required" && <p>Surface can not be empty</p>}

          <div>
            <label htmlFor="furnished">Furnished</label>
            <input
              id="furnished"
              type="checkbox"
              {...register("furnished")}
              checked={property.furnished}
            />
          </div>
          <div>
            <label htmlFor="terrace">Terrace</label>
            <input
              id="terrace"
              type="checkbox"
              {...register("terrace")}
              checked={property.terrace}
            />
          </div>
          <div>
            <label htmlFor="garden">Garden</label>
            <input id="garden" type="checkbox" {...register("garden")} checked={property.garden} />
          </div>
          <div>
            <label htmlFor="caretaker">Caretaker</label>
            <input
              id="caretaker"
              type="checkbox"
              {...register("caretaker")}
              checked={property.caretaker}
            />
          </div>
          <div>
            <label htmlFor="lift">Lift</label>
            <input id="lift" type="checkbox" {...register("lift")} checked={property.lift} />
          </div>

          <input type="submit" />
        </form>
      </div>
    )
  );
};

export default EditPropertyForm;
