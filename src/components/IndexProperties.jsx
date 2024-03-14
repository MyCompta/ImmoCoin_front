import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getPropertiesFetch } from "../services/propertyApi";
import Cookies from "js-cookie";
import { useSetAtom, useAtomValue } from "jotai";
import { errorAtom } from "../atom/errorAtom";
import { cityAtom } from "../atom/userAtom.jsx";
import PropTypes from "prop-types";
import "./IndexProperties.css";
import PropertyCard from "./PropertyCard";
import DisplayMap from "./map.jsx";

const IndexProperties = ({ filter }) => {
  const [properties, setProperties] = useState("");
  const setCity = useSetAtom(cityAtom);
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
          
          const locations = fetchedProperties.map(property => property.location);
          setCity(locations);
        }
      } catch (error) {
        console.error("Error during get properties:", error.message);
        setError("Error fetching properties");
      }
    };
    fetchProperties();
  }, [setError, filter, setCity]);

  let authToken;
  if (Cookies.get("auth_token")) {
    authToken = JSON.parse(Cookies.get("auth_token"));
  }


  // console.log("les properties en index", properties)
  // console.log("les properties en index 0", properties[0])
  // console.log("la ville de la property en index 0", properties[0].location)

  // const cityLocations = useAtomValue(cityAtom);
  // console.log("Locations from cityAtom:", cityLocations);



  return (
    <div className="indexPropertyContainer">
      <div className="indexheader">
        {authToken !== undefined && (
          <Link to="/properties/new" className="btn">
            Add a new property
          </Link>
        )}
        <div className="mapindexproperty">
          <DisplayMap />
        </div>
      </div>
      <h1>Properties on the market</h1>
      <div className="properties-grid">
        {properties.length ? (
          properties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              owned={authToken?.user_id === property.user_id}
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
