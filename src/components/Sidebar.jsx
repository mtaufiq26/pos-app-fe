import React, { useEffect, useState } from "react";
import { Menu, Divider, Button } from "react-daisyui";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import { useAccount } from "../hooks";

export default function Sidebar() {
  const isLoggedIn = Cookies.get("token") ? true : false;
  const { logoutConfirm } = useAccount();

  return (
    <Menu className="w-60 p-5 bg-base-100 space-y-1">
      <Menu.Title className="text-3xl font-bold mb-3">POS App</Menu.Title>
      <Divider />
      {!isLoggedIn ? (
        <>
          <Menu.Item>
            <Link to="login">Login</Link>
          </Menu.Item>
          <Menu.Item>
            <Link to="register">Register</Link>
          </Menu.Item>
        </>
      ) : (
        <>
          <Menu.Item>
            <Button color="ghost" onClick={logoutConfirm}>Logout</Button>
          </Menu.Item>
        </>
      )}
    </Menu>
  );
}
