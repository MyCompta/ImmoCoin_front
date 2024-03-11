import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getPropertyFetch } from "../services/propertyApi";
import { useAtom } from 'jotai';

import { userAtom } from '../atom/userAtom.jsx'

const ShowProperty = () => {
  const { id } = useParams();
  const [property, setProperty] = useState();
  const [user, setUser] = useAtom(userAtom)

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const fetchedProperty = await getPropertyFetch(id);
        setProperty(fetchedProperty);

        setUser((prevUser) => ({
          ...prevUser,
          user_id: fetchedProperty.user_id,
        }))


      } catch (error) {
        console.error("Error during get property:", error.message);
      }
    };
    fetchProperty();
  }, []);

  

  return (
    property && (
      <div className="ShowPropertyContainer">
        <h1>
          {property.title} - ${property.price}
        </h1>
        <p>{property.description}</p>
      </div>
    )
  );
};

export default ShowProperty;
