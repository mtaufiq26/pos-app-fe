import Cookies from "js-cookie";
import axios from "axios";
import endpoint from "../endpoint";

export default async function searchProducts(category = "", keyword = "") {
  const loginData = Cookies.get("token");

  const { data } = await axios.get(
    `${endpoint}/products/search/?keyword=${keyword}${
      category && `&category=${category}`
    }`,
    {
      headers: {
        Authorization: `Bearer ${loginData}`
      }
    }
  );

  console.log(data);
  return data;
}
