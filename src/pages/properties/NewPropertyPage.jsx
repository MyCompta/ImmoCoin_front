import NewPropertyForm from "../../components/NewPropertyForm";

const NewPropertyPage = () => {
  return (
    <div className="NewPropertyContainer" style={{ textAlign: "center" }}>
      <h1>What property do you want to sell ?</h1>
      <NewPropertyForm />
    </div>
  );
};

export default NewPropertyPage;
