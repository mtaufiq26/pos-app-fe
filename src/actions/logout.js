import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

export default function logout() {
  const navigate = useNavigate();
  Cookies.remove("token");
  navigate("/");
}