import Cookies from "js-cookie";
import endpoint from "../endpoint";
import axios from "axios";

export default async function newProduct(data) {
  const loginData = Cookies.get("token");
  console.log(data);

  const formData = new FormData();
  formData.append("product_name", data.product_name);
  formData.append("price", data.price);
  formData.append("description", data.description);
  formData.append("category_id", data.category_id);
  formData.append("product_image", data.product_image)
  
  await axios.post(`${endpoint}/products`, formData, {
    headers: {
      Authorization: `Bearer ${loginData}`
    }
  });
}