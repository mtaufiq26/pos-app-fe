import * as Yup from "yup";

const registerSchema = Yup.object().shape({
  username: Yup.string()
    .min(4, "Minimum char length is 4")
    .required("Username is required")
    .matches(/[a-z0-9\_]/g, "Username can only contain lowercases, numbers, and underscore symbol"),
  email: Yup.string().email().required("Email is required"),
  store_name: Yup.string().required("Store Name is required"),
  phone_num: Yup.string().required("Phone Number is required"),
  password: Yup.string()
    .min(6, "Minimum password length is 6")
    .required("Password is required"),
});

export default registerSchema;
