import { useNavigate } from "react-router-dom";
import Button from "./Button";

function ButtonBack() {
  const navigate = useNavigate();

  function goBack(e) {
    e.preventDefault();
    navigate(-1);
  }
  return (
    <Button type="back" onClick={goBack}>
      &larr; Back
    </Button>
  );
}

export default ButtonBack;
