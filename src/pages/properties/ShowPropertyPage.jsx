import ShowProperty from "../../components/ShowProperty";
import { useEffect } from 'react'
import { Link, useParams } from "react-router-dom";
import ShowProperty from "../../components/ShowProperty";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { deletePropertyFetch } from "../../services/propertyApi";
import { useAtom, useAtomValue } from 'jotai';

import { userAtom } from '../../atom/userAtom.jsx';

const ShowPropertyPage = () => {
  const [user, setUser] = useAtom(userAtom)
  const { id } = useParams();
  const navigate = useNavigate();


  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, [setUser]);

  const authTokenCookie = Cookies.get("auth_token");
  const authToken = authTokenCookie ? JSON.parse(authTokenCookie) : {};
  const currentUserId = authToken.user_id;


  const onClick = async () => {
    let authToken = {};

    if (!Cookies.get("auth_token")) {
      throw new Error("User is not logged in. Unable to delete the property.");
    } else {
      authToken = JSON.parse(Cookies.get("auth_token"));
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


  return (
    <div className="showPropertyContainer">
      <ShowProperty />
           {currentUserId === user.user_id && (
        <>
          <Link to={`/properties/edit/${id}`}>Edit</Link>
          <button onClick={onClick}>Delete</button>
        </>
      )}
    </div>
  );
};

export default ShowPropertyPage;
