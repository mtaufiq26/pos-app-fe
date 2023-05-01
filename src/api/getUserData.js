import axios from "axios";
import Cookies from "js-cookie";
import endpoint from "../endpoint";

export default async function getUserData () {
  const loginData = Cookies.get("token");
  const { data } = await axios.get(`${endpoint}/auth/user`, {
    headers: {
      Authorization: `Bearer ${loginData}`
    }
  });

  return data;
}