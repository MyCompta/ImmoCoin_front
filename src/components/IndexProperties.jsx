import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getPropertiesFetch } from "../services/propertyApi";
import Cookies from "js-cookie";
import { useSetAtom } from "jotai";
import { errorAtom } from "../atom/errorAtom";
import PropTypes from "prop-types";

const IndexProperties = ({ filter }) => {
  const [properties, setProperties] = useState("");
  const setError = useSetAtom(errorAtom);

  useEffect(() => {
    // console.log("Effect is running");
    const fetchProperties = async () => {
      try {
        if (filter) {
          const fetchedProperties = await getPropertiesFetch(filter);
          setProperties(fetchedProperties);
        } else {
          const fetchedProperties = await getPropertiesFetch();
          setProperties(fetchedProperties);
        }
      } catch (error) {
        console.error("Error during get properties:", error.message);
        setError("Error fetching properties");
      }
    };
    fetchProperties();
  }, [setError, filter]);

  const authToken = Cookies.get("auth_token");

  return (
    <div className="indexPropertyContainer">
      {authToken !== undefined && <Link to="/properties/new">Add a new property</Link>}
      <h1>Properties on the market</h1>
      <ul>
        {properties.length ? (
          properties.map((property) => (
            <li key={property.id}>
              <Link to={`/properties/${property.id}`} state={{ property: property }}>
                <h3>{property.title}</h3> <p>${property.price}</p>
                <p>{property.description}</p>
                <p>{property.location}</p>
              </Link>
            </li>
          ))
        ) : (
          <p>No properties found</p>
        )}
      </ul>
    </div>
  );
};

IndexProperties.propTypes = {
  filter: PropTypes.string,
};

export default IndexProperties;
