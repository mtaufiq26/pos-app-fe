import React from "react";
import Products from "../components/Products";
import {
  QueryClient,
  QueryClientProvider
} from "@tanstack/react-query";
import Cookies from "js-cookie";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export default function Mainpage() {
  const client = new QueryClient();
  const loginCookie = Cookies.get("token");

  return (
    <>
      <div className="bg-base-300 w-full rounded-lg p-5">
        <h1 className="text-3xl mb-3">
          Simple POS by Grup 3
        </h1>
        <QueryClientProvider client={client}>
          {loginCookie && <Products />}
          <ReactQueryDevtools />
        </QueryClientProvider>
      </div>
    </>
  );
}
