import axios from "axios";
import Cookies from "js-cookie";
import endpoint from "../endpoint";

export default async function removeCategory (itemId) {
  const loginData = Cookies.get("token");

  await axios.delete(`${endpoint}/products/categories/${itemId}`, {
    headers: {
      Authorization: `Bearer ${loginData}`
    }
  });
}