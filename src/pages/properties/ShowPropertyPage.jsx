import { Link, useParams } from "react-router-dom";
import ShowProperty from "../../components/ShowProperty";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { deletePropertyFetch } from "../../services/propertyApi";

const ShowPropertyPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

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
      <h1>ShowPropertyPage</h1>
      <ShowProperty />
      <Link to={`/properties/edit/${id}`}>Edit</Link>
      <button onClick={onClick}>Delete</button>
    </div>
  );
};

export default ShowPropertyPage;
