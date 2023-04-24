import { useState, useEffect } from "react";
import axios from "axios";
import endpoint from "../endpoint";
import Cookie from "js-cookie";
import { useNavigate, redirect } from "react-router-dom";
import Swal from "sweetalert2";

/**
 *
 * @returns {{login: function, logout: function, loginResult: {[key:string]:any}}}
 */
export default function useAccount() {
  const loginCookie = Cookie.get("token");
  const navigate = useNavigate();
  const [loginResult, setLoginResult] = useState({});

  function login() {
    if (!loginCookie) return {};

    return axios
      .get(`${endpoint}/auth/user`, {
        headers: {
          Authorization: `Bearer ${loginCookie}`,
        },
      })
      .then((res) => setLoginResult(res.data.user));
  }

  function logout() {
    Cookie.remove("token");
    document.location.reload();
  }
  
  function logoutConfirm() {
    Swal.fire({
      title: "Confirm",
      icon: "question",
      text: "Do you want to logout?",
      confirmButtonText: "Yes",
      showDenyButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
      }
    });
  }

  return {
    login,
    logout,
    logoutConfirm,
    loginResult
  };
}
