import { useRef } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { createPropertyFetch } from "../services/propertyApi";
import Cookies from "js-cookie";
import { useSetAtom } from "jotai";
import { errorAtom } from "../atom/errorAtom";

const NewPropertyForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const imagesRef = useRef([]);
  const setError = useSetAtom(errorAtom);

  const onSubmit = async (data) => {
    let authToken = {};
    const formData = new FormData();
    formData.append("property[title]", data.title);
    formData.append("property[price]", data.price);
    formData.append("property[description]", data.description);
    formData.append("property[location]", data.location);
    formData.append("property[furnished]", data.furnished);
    formData.append("property[surface]", data.surface);
    formData.append("property[room]", data.room);
    formData.append("property[floor]", data.floor);
    formData.append("property[terrace]", data.terrace);
    formData.append("property[garden]", data.garden);
    formData.append("property[caretaker]", data.caretaker);
    formData.append("property[lift]", data.lift);

    for (let i = 0; i < imagesRef.current.length; i++) {
      formData.append("property[images][]", imagesRef.current[i]);
    }

    if (!Cookies.get("auth_token")) {
      setError("You need to be logged in to do this action.");
      throw new Error("User is not logged in. Unable to create a property.");
    } else {
      authToken = JSON.parse(Cookies.get("auth_token"));
      formData.append("property[user_id]", authToken.user_id);
    }

    try {
      const response = await createPropertyFetch(formData);

      if (response.ok) {
        const responseData = await response.json();
        navigate(`/properties/${responseData.id}`);
      }
    } catch (error) {
      setError("Error during create property:", error.message);
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
          {...register("location", {
            required: true,
          })}
          placeholder="Location here"
          autoComplete="current-location"
        />
        {errors.location && errors.location.type === "required" && <p>Location can not be empty</p>}

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
