import Cookies from "js-cookie";
import axios from "axios";
import endpoint from "../endpoint";

export default async function editCategory (itemId, data) {
  const loginData = Cookies.get('token');
  
  await axios.put(`${endpoint}/products/categories/${itemId}`, data, {
    headers: {
      Authorization: `Bearer ${loginData}`
    }
  });
}