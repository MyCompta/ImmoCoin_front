import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { getPropertyFetch, updatePropertyFetch } from "../services/propertyApi";
import Cookies from "js-cookie";
import "./EditPropertyForm.scss";
import { useSetAtom } from "jotai";
import { errorAtom } from "../atom/errorAtom";

const EditPropertyForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [property, setProperty] = useState(null);
  const [initialProperty, setInitialProperty] = useState(null);
  const [dragging, setDragging] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const setError = useSetAtom(errorAtom);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const fetchedProperty = await getPropertyFetch(id);
        setProperty(fetchedProperty);

        if (!initialProperty) {
          setInitialProperty(fetchedProperty);
        }
      } catch (error) {
        setError("Error during get property:", error.message);
        console.error("Error during get property:", error.message);
      }
    };
    fetchProperty();
  }, [id, setError]);

  useEffect(() => {
    console.log("initial property", initialProperty);
    console.log("property", property);
  }, [property, initialProperty]);

  const handleFileChange = (e) => {
    setProperty((prevProperty) => {
      const updatedProperty = { ...prevProperty };
      updatedProperty.images = [...prevProperty.images, ...e.target.files];
      return updatedProperty;
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter((file) => file.type.startsWith("image/")); // only images accepted
    setProperty((prevProperty) => {
      const updatedProperty = { ...prevProperty };
      updatedProperty.images = [...prevProperty.images, ...imageFiles];
      return updatedProperty;
    });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragging(false);
  };

  const handleRemoveImage = (index, imageId) => {
    if (imageId) {
      setProperty((prevProperty) => {
        const updatedImages = prevProperty.images.filter(
          (image) => image.id !== imageId
        );
        return { ...prevProperty, images: updatedImages };
      });
    } else {
      setProperty((prevProperty) => {
        const updatedImages = prevProperty.images.filter(
          (image, i) => i !== index
        );
        return { ...prevProperty, images: updatedImages };
      });
    }
  };

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

    //Find added images & append them to formData
    if (property) {
      const imagesWithoutId = property.images.filter((image) => !image.id);
      console.log("Images ajoutées:", imagesWithoutId);
      for (let i = 0; i < imagesWithoutId.length; i++) {
        formData.append("property[images][]", imagesWithoutId[i]);
      }
    }

    // Find deleted images & append them in formData
    if (property && initialProperty) {
      const deletedImages = initialProperty.images.filter(
        (initialImage) =>
          !property.images.some((image) => image.id === initialImage.id)
      );
      console.log("Images supprimées:", deletedImages);
      const deletedImageIds = deletedImages.map((image) => image.id);
      formData.append("deleted_images", JSON.stringify(deletedImageIds));
    }

    if (!Cookies.get("auth_token")) {
      setError("You need to be logged in to do this action.");
      throw new Error("User is not logged in. Unable to edit the property.");
    } else {
      authToken = JSON.parse(Cookies.get("auth_token"));
      formData.append("property[user_id]", authToken.user_id);
    }

    try {
      console.log("formData", formData);
      const response = await updatePropertyFetch(formData, id);

      if (response.ok) {
        navigate(`/properties/${id}`);
      }
    } catch (error) {
      console.error("Error during create property:", error.message);
    }
  };

  return (
    property && (
      <div className="editPropertyForm">
        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            className="editPropertyForm__submit"
            type="submit"
            value="Save changes"
          />

          <div className="editPropertyForm__info">
            <div className="editPropertyForm__row1">
              <div>
                <label htmlFor="title">Title</label>
                <input
                  type="text"
                  {...register("title", {
                    required: true,
                  })}
                  placeholder="Title here"
                  autoComplete="current-title"
                  defaultValue={property.title}
                />
              </div>
              {errors.title && errors.title.type === "required" && (
                <p>Title can not be empty</p>
              )}

              <div>
                <label htmlFor="price">Price</label>
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
              </div>
              {errors.price && errors.price.type === "required" && (
                <p>Price can not be empty</p>
              )}

              <div>
                <label htmlFor="location">Location</label>
                <input
                  type="text"
                  {...register("location", {
                    required: true,
                  })}
                  placeholder="Location here"
                  autoComplete="current-location"
                  defaultValue={property.location}
                />
              </div>
              {errors.location && errors.location.type === "required" && (
                <p>Location can not be empty</p>
              )}

              <div>
                <label htmlFor="description">Description</label>
                <textarea
                  type="text"
                  {...register("description", {
                    required: true,
                  })}
                  placeholder="Description here"
                  autoComplete="current-description"
                  defaultValue={property.description}
                />
              </div>
              {errors.description && errors.description.type === "required" && (
                <p>Description can not be empty</p>
              )}
            </div>

            <div className="editPropertyForm__row2">
              <div>
                <label htmlFor="room">Number of rooms</label>
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
              </div>
              {errors.room && errors.room.type === "required" && (
                <p>Room number can not be empty</p>
              )}

              <div>
                <label htmlFor="floor">Number of floors</label>
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
              </div>
              {errors.room && errors.room.type === "required" && (
                <p>Floor number can not be empty</p>
              )}

              <div>
                <label htmlFor="surface">Surface</label>
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
              </div>
              {errors.surface && errors.surface.type === "required" && (
                <p>Surface can not be empty</p>
              )}

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
                <input
                  id="garden"
                  type="checkbox"
                  {...register("garden")}
                  checked={property.garden}
                />
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
                <input
                  id="lift"
                  type="checkbox"
                  {...register("lift")}
                  checked={property.lift}
                />
              </div>
            </div>
          </div>

          <div className="editPropertyForm__selectFiles">
            <p>Drop your property photos bellow or</p>
            <input
              type="file"
              name="image"
              multiple
              accept="image/*"
              {...register("image")}
              onChange={handleFileChange}
            />
          </div>

          <div
            className="imagesDrop"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            {property.images.map((image, index) => (
              <div
                key={index}
                style={{
                  position: "relative",
                  display: "inline-block",
                  width: "25%",
                }}
              >
                <img
                  src={image.url ? image.url : URL.createObjectURL(image)}
                  alt={`Image ${index}`}
                  style={{
                    width: "80%",
                    margin: "10px",
                    verticalAlign: "top",
                  }}
                />
                <button
                  className="editPropertyForm__removeImage"
                  type="button"
                  onClick={(e) => {
                    e.preventDefault(); // Empêche la soumission du formulaire
                    handleRemoveImage(index, image.id); // Supprime l'image
                  }}
                >
                  &#x2715;
                </button>
              </div>
            ))}
          </div>

          <input
            className="editPropertyForm__submit2"
            type="submit"
            value="Save changes"
          />
        </form>
      </div>
    )
  );
};

export default EditPropertyForm;
