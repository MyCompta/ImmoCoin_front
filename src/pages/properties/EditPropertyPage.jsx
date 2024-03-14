import EditPropertyForm from "../../components/EditPropertyForm";

const EditPropertyPage = () => {
  return (
    <div
      className="editPropertyContainer"
      style={{ margin: "10px", padding: "10px" }}
    >
      <h1>Edit Property</h1>
      <EditPropertyForm />
    </div>
  );
};

export default EditPropertyPage;
