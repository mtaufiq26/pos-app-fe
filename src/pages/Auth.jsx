import React from "react";
import { Form, Input, Button } from "react-daisyui";
import endpoint from "../endpoint";
import { useFormik } from "formik";
import loginSchema from "../schema/loginSchema";
import registerSchema from "../schema/registerSchema";
import axios from "axios";
import Swal from "sweetalert2";
import PassInput from "../components/PassInput";
import { useNavigate } from "react-router-dom";
import Cookie from "js-cookie";

export default function Auth({ register }) {
  const url = `${endpoint}/auth/${register ? "register" : "login"}`;
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      store_name: "",
      phone_num: "",
      password: "",
      confirm_password: "",
    },
    validationSchema: register ? registerSchema : loginSchema,
    onSubmit: (values) => {
      const { username, email, password, phone_num, store_name } = values;

      const dataFields = register
        ? {
            username,
            email,
            password,
            phone_num,
            store_name,
          }
        : {
            email,
            password,
          };

      // Fungsi Login dan Register
      axios
        .post(url, dataFields)
        .then((res) => {
          Swal.fire({
            title: "Success",
            text: res.data.message,
            icon: "success",
          }).then((result) => {
            if (result.isConfirmed || result.isDismissed) {
              switch (register) {
                case true:
                  navigate("/login");
                  break;
                default:
                  Cookie.set("token", res.data.token, { expires: 7 });
                  navigate("/");
              }
            }
          });
        })
        .catch((err) => {
          Swal.fire({
            title: "Error",
            text: err.response.data.message,
            icon: "error",
          });
          console.log(err);
        });
    },
  });

  return (
    <Form onChange={formik.handleChange} onSubmit={formik.handleSubmit}>
      {register && (
        <>
          <label htmlFor="username" className="mb-1">
            Username
          </label>
          <Input
            placeholder="Enter your username"
            id="username"
            name="username"
            className="bg-base-300 w-full mb-3"
          />
          <label htmlFor="username" className="mb-5 text-error">
            {formik.errors.username}
          </label>

          <label htmlFor="store_name" className="mb-1">
            Store Name
          </label>
          <Input
            placeholder="Enter your store name"
            id="store_name"
            name="store_name"
            className="bg-base-300 w-full mb-3"
          />
          <label htmlFor="username" className="mb-5 text-error">
            {formik.errors.store_name}
          </label>

          <label htmlFor="phone_num" className="mb-1">
            Phone Number
          </label>
          <Input
            placeholder="Enter your phone number"
            id="phone_num"
            name="phone_num"
            className="bg-base-300 w-full mb-3"
          />
          <label htmlFor="username" className="mb-5 text-error">
            {formik.errors.phone_num}
          </label>
        </>
      )}

      <label htmlFor="email" className="mb-1">
        Email
      </label>
      <Input
        placeholder="Enter your email"
        id="email"
        name="email"
        className="bg-base-300 w-full mb-3"
      />
      <label htmlFor="username" className="mb-5 text-error">
        {formik.errors.email}
      </label>

      <label htmlFor="password" className="mb-3">
        Password
      </label>
      <PassInput
        placeholder="Enter your password"
        className="mb-3"
        inputClassName="bg-base-300 w-full"
        id="password"
        name="password"
      />
      <label htmlFor="username" className="mb-5 text-error">
        {formik.errors.password}
      </label>

      <Button type="submit" color="success">
        Submit
      </Button>
    </Form>
  );
}
