import axios from "axios";
import Cookies from "js-cookie";

export default function getProducts() {
  const loginData = Cookies.get("token");
  return axios
    .get("http://localhost:8000/products", {
      headers: {
        Authorization: `Bearer ${loginData}`,
      },
    })
    .then((res) => res.data);
}
