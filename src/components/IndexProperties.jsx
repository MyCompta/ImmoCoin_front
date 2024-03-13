import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getPropertiesFetch } from "../services/propertyApi";
import Cookies from "js-cookie";
import { useSetAtom } from "jotai";
import { errorAtom } from "../atom/errorAtom";
import PropTypes from "prop-types";
import "./IndexProperties.css";
import PropertyCard from "./PropertyCard";

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

  const authToken = JSON.parse(Cookies.get("auth_token"));

  return (
    <div className="indexPropertyContainer">
      {authToken !== undefined && (
        <Link to="/properties/new" className="btn">
          Add a new property
        </Link>
      )}
      <h1>Properties on the market</h1>
      <div className="properties-grid">
        {console.log(properties)}
        {properties.length ? (
          properties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              owned={authToken.user_id === property.user_id}
            />
          ))
        ) : (
          <p>No properties found</p>
        )}
      </div>
    </div>
  );
};

IndexProperties.propTypes = {
  filter: PropTypes.string,
};

export default IndexProperties;
