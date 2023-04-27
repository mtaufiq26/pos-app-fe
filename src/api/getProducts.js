import axios from "axios";
import Cookies from "js-cookie";
import endpoint from "../endpoint";

export default async function getProducts(page = 1, order = "product_name", desc = false) {
  const dir = desc ? "DESC" : "ASC"
  const loginData = Cookies.get("token");
  const { data } = await axios.get(
    `${endpoint}/products?page=${page}&orderby=${order}&dir=${dir}`,
    {
      headers: {
        Authorization: `Bearer ${loginData}`,
      },
    }
  );

  return data;
}
