import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getPropertiesFetch } from "../services/propertyApi";

const IndexProperties = () => {
  const [properties, setProperties] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("Effect is running");
    const fetchProperties = async () => {
      try {
        const fetchedProperties = await getPropertiesFetch();
        setProperties(fetchedProperties);
      } catch (error) {
        console.error("Error during get properties:", error.message);
        setError("Error fetching properties");
      }
    };
    fetchProperties();
  }, []);

  console.log("Component is rendered");
  return (
    <div className="indexPropertyContainer">
      <h1>Properties on the market</h1>
      <Link to="/properties/new">Add a new property</Link>
      <ul>
        {properties.length &&
          properties.map((property) => (
            <li key={property.id}>
              <Link to={`/properties/${property.id}`} state={{ property: property }}>
                <h3>{property.title}</h3> <p>${property.price}</p>
                <p>{property.description}</p>
              </Link>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default IndexProperties;
