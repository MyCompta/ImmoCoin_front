import { useState, useEffect, useRef } from "react";
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
  const [images, setImages] = useState([]);
  const [dragging, setDragging] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();
  const imagesRef = useRef([]);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const fetchedProperty = await getPropertyFetch(id);
        setProperty(fetchedProperty);
        setImages(fetchedProperty.images);
      } catch (error) {
        console.error("Error during get property:", error.message);
      }
    };
    fetchProperty();
  }, []);

  const handleFileChange = (e) => {
    //imagesRef.current = [...e.target.files];
    imagesRef.current = [...imagesRef.current, ...e.target.files];
    setImages((prevImages) => [...prevImages, ...e.target.files]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const files = Array.from(e.dataTransfer.files);
    // Filtrer uniquement les fichiers d'image
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));
    // Ajouter les fichiers d'image au tableau d'images
    setImages((prevImages) => [...prevImages, ...imageFiles]);
    // Ajouter les fichiers d'image à la référence des images
    imagesRef.current = [...imagesRef.current, ...imageFiles];
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
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);

    if (imageId) {
      setSelectedImages((prevSelectedImages) => [
        ...prevSelectedImages,
        imageId,
      ]);
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
    formData.append("deleted_images", JSON.stringify(selectedImages)); // images to delete

    console.log("imagesRef.current", imagesRef.current);

    for (let i = 0; i < imagesRef.current.length; i++) {
      formData.append("property[images][]", imagesRef.current[i]); // images to add
    }

    if (!Cookies.get("auth_token")) {
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

  useEffect(() => {
    console.log("selectedImages", selectedImages);
  }, [selectedImages]);

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
              valueAsNumber: true,
            })}
            placeholder="Price here"
            autoComplete="current-price"
            defaultValue={property.price}
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
          {errors.room && errors.room.type === "required" && (
            <p>Room number can not be empty</p>
          )}

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
          {errors.room && errors.room.type === "required" && (
            <p>Floor number can not be empty</p>
          )}

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

          <input
            type="file"
            name="image"
            multiple
            accept="image/*"
            {...register("image")}
            onChange={handleFileChange}
          />

          <div
            className="images"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            style={{
              minHeight: images.length === 0 ? "200px" : "auto", // Taille pour être visible quand vide
              border: dragging ? "2px solid green" : "2px dashed #ccc", // Changement de cadre au survol
            }}
          >
            {images.map((image, index) => (
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
                  style={{
                    position: "absolute",
                    top: "5px",
                    right: "5px",
                    backgroundColor: "transparent",
                    border: "none",
                    cursor: "pointer",
                  }}
                  onClick={(e) => {
                    e.preventDefault(); // Empêche la soumission du formulaire
                    handleRemoveImage(index, image.id); // Supprime l'image
                  }}
                >
                  &#x2715; {/* Cross symbol */}
                </button>
              </div>
            ))}
          </div>

          <input type="submit" />
        </form>
      </div>
    )
  );
};

export default EditPropertyForm;
