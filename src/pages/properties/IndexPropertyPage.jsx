import { useEffect, useState } from "react";
import { getPropertiesFetch } from "../../services/propertyApi";
import { Link } from "react-router-dom";

export default function IndexPropertyPage() {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const fetchedProperties = await getPropertiesFetch({ owned: true });
        setProperties(fetchedProperties);
      } catch (error) {
        console.error("Error during get properties:", error.message);
      }
    };
    fetchProperties();
  }, []);
  return (
    <ul>
      {properties.length ? (
        properties.map((property) => (
          <li key={property.id}>
            <Link to={`/properties/${property.id}`} state={{ property: property }}>
              <h3>{property.title}</h3> <p>${property.price}</p>
              <p>{property.description}</p>
            </Link>
          </li>
        ))
      ) : (
        <p>No properties found</p>
      )}
    </ul>
  );
}
