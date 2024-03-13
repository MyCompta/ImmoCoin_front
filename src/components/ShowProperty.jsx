import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getPropertyFetch } from "../services/propertyApi";
import { Link, useNavigate } from "react-router-dom";
import { deletePropertyFetch } from "../services/propertyApi";
import { useSetAtom } from "jotai";
import Cookies from "js-cookie";
import "./ShowProperty.css";
import { errorAtom } from "../atom/errorAtom";
import { userAtom } from "../atom/userAtom.jsx";

const ShowProperty = () => {
  const { id } = useParams();
  const [property, setProperty] = useState();
  const setUser = useSetAtom(userAtom);
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
      } catch (error) {
        setError("Error during get property:", error.message);
        console.error("Error during get property:", error.message);
      }
    };
    fetchProperty();
  }, [id, setUser, setError]);

  const displayFullScreenThumbnail = () => {
    const fullScreen = document.getElementById("fullScreen");
    if (fullScreen.style.display === "none") {
      fullScreen.style.display = "block";
    } else {
      fullScreen.style.display = "none";
    }
  };

  return (
    property && (
      <>
        <div className="ShowPropertyContainer">
          <div className="thumbnail">
            <img
              src={property.image ? property.image : "https://via.placeholder.com/600x400"}
              alt={property.title}
              onClick={displayFullScreenThumbnail}
            />
            <p className="price">${property.price}</p>
          </div>
          <h1>{property.title}</h1>
          <p>{property.description}</p>
          <div className="actions">
            <a className="contact" href={`mailto:${property.owner_email}`}>
              Contact seller
            </a>
            <a href={`mailto:${property.owner_email}`}>{property.owner_email}</a>
          </div>
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
          <img
            id="fullScreen"
            src={property.image ? property.image : "https://via.placeholder.com/600x400"}
            alt={property.title}
            style={{ display: "none" }}
            onClick={displayFullScreenThumbnail}
          />
        </div>
        {property.user_id === user_id && (
          <>
            <hr />
            <div className="actions">
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
