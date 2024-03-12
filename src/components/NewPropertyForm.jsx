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

  const onSubmit = async (data) => {
    if (!Cookies.get("auth_token")) {
      console.log("User is not logged in. Unable to create a property.");
      throw new Error("User is not logged in. Unable to create a property.");
    }

    try {
      const response = await createPropertyFetch(
        data.title,
        data.price,
        data.description,
        data.furnished,
        data.surface,
        data.room,
        data.floor,
        data.terrace,
        data.garden,
        data.caretaker,
        data.lift
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
        {errors.title && errors.title.type === "required" && <p>Title can not be empty</p>}

        <input
          type="number"
          {...register("price", {
            required: true,
            valueAsNumber: true,
          })}
          placeholder="Price here"
          autoComplete="current-price"
        />
        {errors.price && errors.price.type === "required" && <p>Price can not be empty</p>}

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
          type="number"
          {...register("room", {
            required: true,
            valueAsNumber: true,
          })}
          min={0}
          step={1}
          placeholder="room"
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
        />
        {errors.surface && errors.surface.type === "required" && <p>Surface can not be empty</p>}

        <div>
          <label htmlFor="furnished">Furnished</label>
          <input id="furnished" type="checkbox" {...register("furnished")} />
        </div>
        <div>
          <label htmlFor="terrace">Terrace</label>
          <input id="terrace" type="checkbox" {...register("terrace")} />
        </div>
        <div>
          <label htmlFor="garden">Garden</label>
          <input id="garden" type="checkbox" {...register("garden")} />
        </div>
        <div>
          <label htmlFor="caretaker">Caretaker</label>
          <input id="caretaker" type="checkbox" {...register("caretaker")} />
        </div>
        <div>
          <label htmlFor="lift">Lift</label>
          <input id="lift" type="checkbox" {...register("lift")} />
        </div>

        <input type="submit" />
      </form>
    </div>
  );
};

export default NewPropertyForm;
