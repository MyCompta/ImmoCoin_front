import IndexProperties from "../../components/IndexProperties";
import PropTypes from "prop-types";

const IndexPropertyPage = ({ filter }) => {
  return <IndexProperties filter={filter} />;
};

IndexPropertyPage.propTypes = {
  filter: PropTypes.string,
};

export default IndexPropertyPage;
