import { useNavigate } from "react-router-dom";
import "./CloseButton.css";

export default function CloseButton() {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate("/");
  };

  return (
    <button className="close" onClick={handleClose}>
      X
    </button>
  );
}
