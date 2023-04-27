import axios from "axios";
import Cookies from "js-cookie";
import endpoint from "../endpoint";

export default async function getCategories() {
  const loginData = Cookies.get("token");
  const { data } = await axios.get(`${endpoint}/products/categories`, {
    headers: {
      Authorization: `Bearer ${loginData}`
    }
  });

  return data;
}