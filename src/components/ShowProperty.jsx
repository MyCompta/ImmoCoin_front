import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getPropertyFetch } from "../services/propertyApi";
import { Link, useNavigate } from "react-router-dom";
import { deletePropertyFetch } from "../services/propertyApi";
import Cookies from "js-cookie";
import "./ShowProperty.css";

const ShowProperty = () => {
  const { id } = useParams();
  const [property, setProperty] = useState();
  const navigate = useNavigate();

  const user_id = Cookies.get("auth_token") ? JSON.parse(Cookies.get("auth_token")).user_id : null;

  const deleteProperty = async () => {
    if (!Cookies.get("auth_token")) {
      throw new Error("User is not logged in. Unable to delete the property.");
    }

    try {
      const response = await deletePropertyFetch(id);

      if (response.ok) {
        navigate(`/`);
      }
    } catch (error) {
      console.error("Error during create property:", error.message);
    }
  };

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
  }, [id]);

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
