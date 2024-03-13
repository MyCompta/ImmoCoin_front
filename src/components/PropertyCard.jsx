import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import "./PropertyCard.css";

export default function PropertyCard({ property, owned }) {
  return (
    <div className={"propertyCard" + (owned ? " owned" : "")}>
      <Link to={`/properties/${property.id}`} state={{ property: property }}>
        {property.images.length > 0 && (
          <img src={property.images[0]} alt={property.title} className="propertyImage" />
        )}
        <div className="propertyInfo">
          <h3>{property.title}</h3> <p>${property.price}</p>
          <p>{property.description}</p>
          {property.location && <p className="pills">{property.location}</p>}
        </div>
      </Link>
    </div>
  );
}

PropertyCard.propTypes = {
  property: PropTypes.object,
  owned: PropTypes.bool,
};
