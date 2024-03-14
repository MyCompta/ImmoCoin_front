import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getPropertyFetch } from "../services/propertyApi";
import { Link, useNavigate } from "react-router-dom";
import { deletePropertyFetch } from "../services/propertyApi";
import { useAtom, useSetAtom, useAtomValue } from "jotai";
import Cookies from "js-cookie";
import "./ShowProperty.css";
import { errorAtom } from "../atom/errorAtom";
import { userAtom, cityAtom } from "../atom/userAtom.jsx";
import DisplayMap from "./map.jsx";

const ShowProperty = () => {
  const { id } = useParams();
  const [property, setProperty] = useState();
  const setUser = useSetAtom(userAtom);
  const setCity = useSetAtom(cityAtom);
  const navigate = useNavigate();
  const setError = useSetAtom(errorAtom);

  const user_id = Cookies.get("auth_token") ? JSON.parse(Cookies.get("auth_token")).user_id : null;

  const deleteProperty = async () => {
    if (!Cookies.get("auth_token")) {
      setError("You need to be logged in to do this action.");
      throw new Error("User is not logged in. Unable to delete the property.");
    }

    try {
      const response = await deletePropertyFetch(id);

      if (response.ok) {
        navigate(`/`);
      }
    } catch (error) {
      setError("Error during delete property:", error.message);
      console.error("Error during create property:", error.message);
    }
  };

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const fetchedProperty = await getPropertyFetch(id);
        setProperty(fetchedProperty);


        setUser((prevUser) => ({
          ...prevUser,
          user_id: fetchedProperty.user_id,
        }));

        const city = fetchedProperty.location;
        setCity(city.split());
        //console.log(city)


      } catch (error) {
        setError("Error during get property:", error.message);
        console.error("Error during get property:", error.message);
      }
    };
    fetchProperty();
  }, [id, setUser, setError, setCity]);


  const displayFullScreenThumbnail = (e) => {
    e.preventDefault();
    const fullScreen = document.getElementById("fullScreen");
    fullScreen.src = e.target.src;
    fullScreen.setAttribute("data-index", e.target.getAttribute("data-index"));
    const fullScreenParent = fullScreen.parentElement;
    if (fullScreenParent.style.display === "none") {
      fullScreenParent.style.display = "block";
    } else {
      fullScreenParent.style.display = "none";
    }
  };

  const changeImageIndex = (n) => {
    const fullScreen = document.getElementById("fullScreen");
    const index = Number(fullScreen.getAttribute("data-index"));
    let newIndex = index + n;
    if (newIndex < 0) {
      newIndex = property.images.length - 1;
    } else if (newIndex >= property.images.length) {
      newIndex = 0;
    }
    fullScreen.setAttribute("data-index", newIndex);
    fullScreen.src = property.images[newIndex].url;
  };


  return (
    property && (
      <>

        <div className="ShowPropertyContainer">
          <div className="top_property">
            <div className="propertytitle">
              <h1>{property.title}</h1>
            </div>
            <div className="thumbnail">
              <img
                src={
                  property.images?.length
                    ? property.images[0].url
                    : "https://via.placeholder.com/600x400"
                }
                alt={property.title}
                onClick={displayFullScreenThumbnail}
                data-index={0}
              />
              <p className="price">${property.price}</p>
            </div>
            <div className="image_gallery">
              {property.images?.length > 1 &&
                property.images
                  .slice(1)
                  .map((image, index) => (
                    <img
                      key={index}
                      src={image.url}
                      alt={property.title}
                      onClick={displayFullScreenThumbnail}
                      data-index={index + 1}
                    />
                  ))}
            </div>
          </div>
          <div>
            <div className="details">
              <p>Location: {property.location}</p>
              <p>Furnished: {property.furnished ? "Yes" : "No"}</p>
              <p>Surface: {property.surface}m2</p>
              <p>Room: {property.room}</p>
              <p>Floor: {property.floor}</p>
              <p>Terrace: {property.terrace ? "Yes" : "No"}</p>
              <p>Garden: {property.garden ? "Yes" : "No"}</p>
              <p>Caretaker: {property.caretaker ? "Yes" : "No"}</p>
              <p>Lift: {property.lift ? "Yes" : "No"}</p>
            </div>
            <div className="propertydescription">
              <p>{property.description}</p>
            </div>
          </div>
          <div>
            <div>
              <div className="map">
                <DisplayMap />
              </div>
              <div className="actions">
                <a className="contact" href={`mailto:${property.owner_email}`}>
                  Contact seller
                </a>
                <a href={`mailto:${property.owner_email}`}>{property.owner_email}</a>
              </div>
            </div>
          </div>
          <div className="modal_img" style={{ display: "none" }}>
            <div className="prev" onClick={() => changeImageIndex(-1)}>
              {"<"}
            </div>
            <img
              id="fullScreen"
              alt={property.title}
              onClick={displayFullScreenThumbnail}
              data-index="0"
            />
            <div className="next" onClick={() => changeImageIndex(1)}>
              {">"}
            </div>
          </div>
        </div>
        {property.user_id === user_id && (
          <>
            <hr />
            <div className="actions-button">
              <Link to={`/properties/edit/${id}`}>Edit</Link>
              <button onClick={deleteProperty}>Delete</button>
            </div>
          </>
        )}
      </>
    )
  );
};

export default ShowProperty;
